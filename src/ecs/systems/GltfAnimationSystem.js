import Systems from "../core/System";
import { GltfAnimation } from "../components";

export class GltfAnimationSystem extends Systems {
  constructor(game) {
    super(game);

    this.game = game;
    this.animating = game.world.world.createQuery({
      all: [GltfAnimation],
    })._cache;
  }

  update(dt) {}
}
