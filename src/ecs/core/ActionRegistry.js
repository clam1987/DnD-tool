import { Vector3 } from "three";
import { Velocity } from "../components";
import {
  MOVE_BACKWARD,
  MOVE_FORWARD,
  MOVE_LEFT,
  MOVE_RIGHT,
} from "../../utils/actions";

const action_registry = new Map();

export const ActionRegistry = {
  register(name, fn) {
    if (action_registry.has(name)) {
      console.warn(`Action: ${name}, already exists. Overwriting`);
    }
    action_registry.set(name, fn);
  },
  execute(name, entity, payload, context) {
    const fn = action_registry.get(name);
    if (!fn) {
      console.warn(`Action ${name}, does not exist in registry.`);
      return;
    }

    fn(entity, payload, context);
  },
  clear() {
    action_registry.clear();
  },
  has(name) {
    return action_registry.has(name);
  },
  get() {
    return action_registry;
  },
};

export function registerDefaultActions() {
  ActionRegistry.register("changeColor", (entity, payload) => {
    const mesh = entity.renderable.group;
    if (mesh) {
      const current_color = mesh.material.color.getHex();
      mesh.material.color.set(
        current_color === "#2fc5f6" ? "#ffffff" : "#2fc5f6"
      );
    }
  });

  ActionRegistry.register("goToScene", (entity, payload) => {
    this.managers.get("sceneManager").loadScene(payload.scene);
  });

  ActionRegistry.register("getMouseCoords", (entity, payload) => {
    const { x, y } = payload;
    console.log(`Mouse Coords: ${x}, ${y}`);
  });

  ActionRegistry.register("changeURL", (entity, payload) => {
    const { url } = payload;
    window.location.href = url;
  });

  ActionRegistry.register("moveEntity", (entity, payload) => {
    if (!entity.position || !entity.renderable) return;

    const { x, y, z } = payload;

    const new_pos = new Vector3(x, y, z);

    entity.position.coords.copy(new_pos);

    entity.renderable.group.position.copy(new_pos);
  });

  ActionRegistry.register("movement", (entity, payload, { input_manager }) => {
    const actions = input_manager.getActiveActions();
    const camera = input_manager.game.managers.get("sceneManager").getCamera();

    const movement_plane = entity.spriteLoader
      ? "2d"
      : entity.gltfLoader
      ? "3d"
      : "2d";

    if (!entity.velocity) {
      entity.add(Velocity, {
        vector: new Vector3(0, 0, 0),
        speed: entity.player.speed,
      });
    }

    const camera_forward = new Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .setY(0)
      .normalize();
    const camera_right = new Vector3(1, 0, 0)
      .applyQuaternion(camera.quaternion)
      .setY(0)
      .normalize();

    const vector = entity.velocity.vector;
    const speed = entity.velocity.speed / (entity.velocity.speed * 1000);
    vector.set(0, 0, 0);

    let direction;
    for (const action of payload.directions) {
      if (actions.includes(action)) {
        switch (action) {
          case MOVE_FORWARD:
            if (movement_plane === "2d") vector.y += speed;
            else vector.add(camera_forward);
            direction = "back";
            break;
          case MOVE_BACKWARD:
            if (movement_plane === "2d") vector.y -= speed;
            else vector.sub(camera_forward);
            direction = "front";
            break;
          case MOVE_LEFT:
            if (movement_plane === "2d") vector.x += speed;
            else vector.sub(camera_right);
            direction = "left";
            break;
          case MOVE_RIGHT:
            if (movement_plane === "2d") vector.x -= speed;
            else vector.add(camera_right);
            direction = "right";
            break;
          default:
            break;
        }
      }
    }

    // Normalize vector to prevent faster diagonal movement
    if (vector.lengthSq() > 0) {
      vector.normalize().multiplyScalar(speed);
      if (direction) {
        if (movement_plane === "2d") {
          entity.fireEvent("update-current", { current: `${direction}_walk` });
        } else {
          const anim_cfg =
            input_manager.game.config.data.assets.animations[
              entity.gltfLoader.asset_name
            ];
          // Mapping from 2d movement to 3d
          const animation_map = {
            back: "walk_forward",
            front: "walk_backward",
            left: "walk_left",
            right: "walk_right",
          };
          const is_moving = actions.length > 0;
          if (is_moving) {
            if (entity.gltfAnimation.state === "idle") {
              entity.fireEvent("update-gltf-current", {
                state: animation_map[direction],
                clip_name: anim_cfg[animation_map[direction]].clip,
                loop: anim_cfg[animation_map[direction]].loop,
              });
            }
          }
        }
        entity.fireEvent("update-direction", { direction });
      }
    } else {
      if (movement_plane === "2d") {
        entity.fireEvent("update-current", { current: "idle" });
        vector.set(0, 0, 0);
      }
    }
  });
}
