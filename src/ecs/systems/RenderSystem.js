import System from "../core/System";
import { Text } from "../components";

export class RenderSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.rendered = new Set();
    this.scene = null;
    this.text = game.world.world.createQuery({
      all: [Text],
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

    for (const entity of this.text) {
      const { text, id } = entity;
      if (!this.rendered.has(id)) {
        entity.fireEvent("create-text");
      }

      if (text.mesh && !this.rendered.has(id)) {
        this.scene.add(text.mesh);
        this.rendered.add(id);
      }
    }
  }
}
