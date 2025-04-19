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

  handleInputs(dt) {
    const active_keys = this.input_manager.getActiveKeys();

    for (const entity of this.player) {
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

      const vector = entity.velocity.vector;
      const speed = entity.velocity.speed / 1000;
      vector.set(0, 0, 0);

      // Multiple keys can be held simultaneously for diagonal movement
      if (active_keys.includes("KeyW")) {
        if (movement_plane === "2d") vector.y += speed;
        else vector.z -= speed;
      }

      if (active_keys.includes("KeyS")) {
        if (movement_plane === "2d") vector.y -= speed;
        else vector.z += speed;
      }

      if (active_keys.includes("KeyA")) {
        vector.x -= speed;
      }

      if (active_keys.includes("KeyD")) {
        vector.x += speed;
      }

      // Normalize vector to prevent faster diagonal movement
      if (vector.lengthSq() > 0) {
        vector.normalize().multiplyScalar(speed);
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
