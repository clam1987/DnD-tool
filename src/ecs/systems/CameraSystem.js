import { PerspectiveCamera, OrthographicCamera } from "three";
import System from "../core/System";
import { Camera, Position } from "../components";

export class CameraSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.scene_manager = null;
    this.cameras = game.world.world.createQuery({
      all: [Camera],
    })._cache;
  }

  update(dt) {
    if (!this.scene_manager) {
      this.scene_manager = this.game.managers.get("sceneManager");
    } else {
      for (const entity of this.cameras) {
        const { fov, near, far, zoom } = entity.camera;
        const aspect = window.innerWidth / window.innerHeight;
        let camera = null;

        if (entity.camera.type === "perspective") {
          camera = new PerspectiveCamera(fov, aspect, near, far);
        } else {
          const height = window.innerHeight / zoom;
          const width = window.innerWidth / zoom;
          camera = new OrthographicCamera(
            -width / 2,
            width / 2,
            height / 2,
            -height / 2,
            near,
            far
          );
        }

        entity.fireEvent("set-camera", { camera });
        this.scene_manager.setCamera(camera);

        if (entity?.position && entity?.camera) {
          const { x, y, z } = entity.position.coords;
          camera.position.set(x, y, z);
        }
      }
    }
  }
}
