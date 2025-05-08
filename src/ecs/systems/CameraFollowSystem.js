import System from "../core/System";
import { Position, Camera, CameraFollow, Player } from "../components";
import { Vector3 } from "three";

export class CameraFollowSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.scene_manager = null;
    this.camera = game.world.world.createQuery({
      all: [Camera, Position, CameraFollow],
    })._cache;
    this.player = game.world.world.createQuery({
      all: [Player],
    })._cache;
  }

  update(dt) {
    if (!this.scene_manager) {
      this.scene_manager = this.game.managers.get("sceneManager");
    } else {
      for (const entity of this.camera) {
        const camera = entity.camera;
        const follow = entity.cameraFollow;
        const position = entity.position;

        const target_entity = this.player.find(
          (player) => player.id === follow.target
        );

        if (!target_entity || !target_entity.position) continue;
        const target_pos = target_entity.position.coords;

        // Compute camera pos = target + offset (in world space)
        const desired_pos = new Vector3().copy(target_pos).add(follow.offset);

        // lerp current camera pos to desired

        position.coords.lerp(desired_pos, Math.min(1, dt * follow.damping));

        const three_cam = this.scene_manager.getCamera();
        three_cam.position.copy(position.coords);
        three_cam.lookAt(target_pos);
        three_cam.updateMatrixWorld();
      }
    }
  }
}
