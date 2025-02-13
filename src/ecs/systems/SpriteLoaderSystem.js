import System from "../core/System";
import { Sprite } from "../components";

export class SpriteLoaderSystem extends System {
  constructor(game) {
    super(game);

    this.active_scene = null;
    this.sprite = game.world.world.createQuery({
      all: [Sprite],
    })._cache;
  }

  preload(assets) {}

  update(dt) {}
}
