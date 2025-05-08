import System from "../core/System";
import { CameraFollow } from "../components";
import { Vector2, Vector3, Quaternion } from "three";

export class CameraOrbitSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.input_manager = null;
    this.spherical = { theta: 0, phi: Math.PI / 4 }; // Angles
    this.camera = this.game.world.world.createQuery({
      all: [CameraFollow],
    })._cache;
  }

  update(dt) {
    if (!this.input_manager) {
      this.input_manager = this.game.managers.get("inputManager");
    }

    const mouse = this.input_manager.getMouse();
    const { dx, dy } = mouse;
    const sensitivity = 1.5;
    this.spherical.theta -= dx * sensitivity; //horizontal
    this.spherical.phi = Math.max(
      0.1,
      Math.min(Math.PI / 2 - 0.1, this.spherical.phi + dy * sensitivity)
    );

    for (const entity of this.camera) {
      const follow = entity.cameraFollow;
      const r = follow.offset.length();
      const x =
        r * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
      const y = r * Math.cos(this.spherical.phi);
      const z =
        r * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);
      follow.offset.set(x, y, z);
    }
  }
}
