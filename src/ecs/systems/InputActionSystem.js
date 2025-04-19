import System from "../core/System";
import {
  MOVE_BACKWARD,
  MOVE_FORWARD,
  MOVE_LEFT,
  MOVE_RIGHT,
  KEYUP,
  KEYDOWN,
} from "../../utils/actions";
import { Player, Velocity } from "../components";
import { Vector3 } from "three";

export class InputActionSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.input_manager = null;
    this.player = game.world.world.createQuery({
      all: [Player],
    })._cache;
  }

  handleInputAction(filtered_inputs) {
    if (!filtered_inputs) return;

    const key_down = filtered_inputs.find((input) => input.type === KEYDOWN);
    const key_up = filtered_inputs.find((input) => input.type === KEYUP);

    if (key_down) {
      for (const entity of this.player) {
        const movement_plane = entity.spriteLoader
          ? "2d"
          : entity.gltfLoader
          ? "3d"
          : "2d";
        if (!entity?.velocity) {
          entity.add(Velocity, {
            vector: new Vector3(0, 0, 0),
            speed: entity.player.speed,
          });
        } else {
          entity.velocity.vector.set(0, 0, 0);
        }

        const vector = entity.velocity.vector;
        vector.set(0, 0, 0);

        switch (key_down.action) {
          case MOVE_FORWARD:
            if (movement_plane === "2d")
              vector.y = entity.velocity.speed / 1000;
            if (movement_plane === "3d")
              vector.z = -(entity.velocity.speed / 1000);
            break;
          case MOVE_BACKWARD:
            if (movement_plane === "2d")
              vector.y = -(entity.velocity.speed / 1000);
            if (movement_plane === "3d")
              vector.z = entity.velocity.speed / 1000;
            break;
          case MOVE_LEFT:
            vector.x = -(entity.velocity.speed / 1000);
            break;
          case MOVE_RIGHT:
            vector.x = entity.velocity.speed / 1000;
            break;
          default:
            break;
        }

        if (key_up) {
          vector.set(0, 0, 0);
        }
      }
    }

    if (key_up) {
      this.input_manager.useInputType(key_down);
      this.input_manager.useInputType(key_up);
    }
  }

  handleInputs(dt) {
    const input_stack = this.input_manager.input_stack;
    if (input_stack.length > 0) {
      const filtered_input = input_stack.filter(
        (input) => input.type === KEYUP || input.type === KEYDOWN
      );

      if (filtered_input.length > 0) {
        this.handleInputAction(filtered_input);
      }
    }
  }

  update(dt) {
    if (!this.input_manager) {
      this.input_manager = this.game.managers.get("inputManager");
    } else {
      this.handleInputs(dt);
    }
  }
}
