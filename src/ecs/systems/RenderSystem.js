import System from "../core/System";
import { Renderable } from "../components";

export class RenderSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.rendered = new Set();
    this.scene = null;
    this.asset_manager = game.managers.get("assetLoaderManager");
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

      if (camera && renderer) {
        renderer.render(this.scene, camera);
      }
    }

    if (!this.asset_manager) {
      this.asset_manager = this.game.managers.get("assetLoaderManager");
    }

    for (const entity of this.renderable) {
      const { id, renderable, position } = entity;
      if (!this.rendered.has(id) && !this.renderable.updated) {
        if (entity?.spriteLoader) {
          const asset = this.asset_manager.get(entity.spriteLoader.name);
          if (asset) {
            const { texture, frames } = asset;
            entity.fireEvent("create-object", {
              texture,
              frames,
            });
          }
        } else if (entity?.gltfLoader) {
          const asset = this.asset_manager.get(entity.gltfLoader.asset_name);
          entity.fireEvent("create-object", { model: asset });
        } else {
          entity.fireEvent("create-object");
        }
      }

      if (renderable.group && !this.rendered.has(id)) {
        this.scene.add(renderable.group);
        this.rendered.add(id);
      }

      if (!renderable.group.position.equals(position.coords)) {
        renderable.group.position.copy(position.coords);
      }
    }
  }
}
