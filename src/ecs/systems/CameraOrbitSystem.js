import System from "../core/System";
import { CameraFollow } from "../components";
import { Vector3, Spherical } from "three";

export class CameraOrbitSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.input_manager = null;
    this.spherical = new Spherical(20, Math.PI / 4, 0); // Angles
    this.target_theta = this.spherical.theta;
    this.target_phi = this.spherical.phi;
    this.current_phi = this.spherical.phi;
    this.current_theta = this.spherical.theta;
    this.sensitivity = 20.5;
    this.smoothing = 0.08;
    this.MIN_PHI = 0.2;
    this.MAX_PHI = Math.PI / 2.2;

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
    this.target_theta -= dx * this.sensitivity;
    this.target_phi += dy * this.sensitivity;

    this.target_phi = Math.max(
      this.MIN_PHI,
      Math.min(this.MAX_PHI, this.target_phi)
    );

    this.current_theta +=
      (this.target_theta - this.current_theta) * this.smoothing;
    this.current_phi += (this.target_phi - this.current_phi) * this.smoothing;

    mouse.dx = 0;
    mouse.dy = 0;

    this.spherical.theta = this.current_theta;
    this.spherical.phi = this.current_phi;

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
