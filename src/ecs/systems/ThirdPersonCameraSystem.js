import System from "../core/System";
import { Camera, CameraFollow, Player, Position } from "../components";
import { Spherical, Vector3 } from "three";

export class ThirdPersonCameraSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.input = null;
    this.scene = null;
    this.camera = game.world.world.createQuery({
      all: [Camera, CameraFollow, Position],
    })._cache;
    this.player = game.world.world.createQuery({
      all: [Player, Position],
    })._cache;

    this.spherical = new Spherical(10, Math.PI / 4, Math.PI / 4);
    this.target_phi = this.spherical.phi;
    this.target_theta = this.spherical.theta;
    this.smoothing = 0.08;
    this.min_phi = 0.2;
    this.max_phi = Math.PI / 2.2;
    this, (sensitivity = 0.002);
  }

  update(dt) {
    if (!this.input) {
      this.input = this.game.managers.get("inputManager");
      this.scene = this.game.managers.get("sceneManager");
    }

    const { dx, dy } = this.input.getMouse();
  }
}
