import { PerspectiveCamera, OrthographicCamera, Group } from "three";
import System from "../core/System";
import { Camera } from "../components";

export class CameraSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.scene_manager = null;
    this._initialized = false;
    this.cameras = game.world.world.createQuery({
      all: [Camera],
    })._cache;
  }

  update(dt) {
    if (!this.scene_manager) {
      this.scene_manager = this.game.managers.get("sceneManager");
    } else {
      for (const entity of this.cameras) {
        const { fov, near, far, zoom, type } = entity.camera;
        const aspect = window.innerWidth / window.innerHeight;
        let camera = null;

        if (type === "perspective") {
          camera = new PerspectiveCamera(fov, aspect, near, far);
        } else {
          const height = window.innerHeight / zoom;
          const width = window.innerWidth / zoom;
          camera = new OrthographicCamera(
            -width / 2 / zoom,
            width / 2 / zoom,
            height / 2 / zoom,
            -height / 2 / zoom,
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

        this._initialized = true;
      }
    }
  }
}
