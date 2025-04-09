import System from "../core/System";
import { Renderable } from "../components";

export class RenderSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.rendered = new Set();
    this.scene = null;
    this.renderable = game.world.world.createQuery({
      all: [Renderable],
    })._cache;
  }

  update(dt) {
    if (this.scene === null) {
      this.scene = this.game.managers.get("sceneManager").getScene();
    } else {
      const sceneManager = this.game.managers.get("sceneManager");
      const camera = sceneManager.getCamera();
      const renderer = sceneManager.getRenderer();

      renderer.render(this.scene, camera);
    }

    for (const entity of this.renderable) {
      const { id, renderable } = entity;
      if (!this.rendered.has(id) && !this.renderable.updated) {
        entity.fireEvent("create-object");
      }

      if (renderable.group && !this.rendered.has(id)) {
        this.scene.add(renderable.group);
        this.rendered.add(id);
      }
    }
  }
}
