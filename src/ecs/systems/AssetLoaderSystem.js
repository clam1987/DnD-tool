import System from "../core/System";
import { SpriteLoader, GltfLoader } from "../components";

export class AssetLoaderSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.asset_manager = game.managers.get("assetLoaderManager");

    this.sprite = game.world.world.createQuery({
      all: [SpriteLoader],
    })._cache;
    this.gltf = game.world.world.createQuery({
      all: [GltfLoader],
    })._cache;
  }

  update(dt) {
    if (!this.asset_manager) {
      this.asset_manager = this.game.managers.get("assetLoaderManager");
    } else {
      for (const entity of this.sprite) {
        const { spriteLoader } = entity;
        if (!spriteLoader.loaded) {
          this.asset_manager
            .loadSprite(
              spriteLoader.asset_name,
              spriteLoader.asset_path,
              spriteLoader.json_path
            )
            .then((evt) => {
              entity.fireEvent("sprite-loaded");
            })
            .catch((err) => {
              console.error("Error loading sprite:", err);
            });
        }
      }
      for (const entity of this.gltf) {
        const { gltfLoader } = entity;
        if (!gltfLoader.loaded) {
          this.asset_manager
            .loadGLTF(gltfLoader.asset_name, gltfLoader.path)
            .then(() => {
              entity.fireEvent("gltf-loaded");
            });
        }
      }
    }
  }
}
