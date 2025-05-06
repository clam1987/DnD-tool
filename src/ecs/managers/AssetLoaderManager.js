import Manager from "./Manager";
import { TextureLoader, SRGBColorSpace } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class AssetLoaderManager extends Manager {
  constructor(game) {
    super(game);

    this.cache = new Map();
    this.total_assets = 0;
    this.assets_loaded = 0;
    this.sprites_loaded = false;
    this.gltf_loaded = false;
    this.ready = false;
  }

  async loadSprite(name, asset_path, json_path) {
    if (this.cache.has(name)) return this.cache.get(name);

    const texture = await new Promise((res, rej) => {
      const loader = new TextureLoader();
      loader.load(
        `/games/${this.game.config.name}${asset_path}`,
        res,
        undefined,
        rej
      );
    });

    texture.colorSpace = SRGBColorSpace;

    const json = await fetch(`/games/${this.game.config.name}${json_path}`);
    const json_data = await json.json();

    this.cache.set(name, { texture, frames: json_data.frames });

    return texture;
  }

  async loadGLTF(name, asset_path) {
    if (this.cache.has(name)) return this.cache.get(name);
    const loader = new GLTFLoader();
    const gltf = await new Promise((res, rej) => {
      loader.load(
        `/games/${this.game.config.name}${asset_path}`,
        res,
        undefined,
        rej
      );
    });
    this.cache.set(name, { scene: gltf.scene, clips: gltf.animations });

    return this.cache.get(name);
  }

  async loadAssets(config) {
    if (!config) {
      console.error("Incorrect config!");
      return this.cache;
    }
    const { sprites, models } = config.data.assets;
    const loading_promises = [];

    try {
      if (sprites && Array.isArray(sprites)) {
        const scene_list = config.data.scenes.map((scene) => scene.name);
        const scene_set = new Set(scene_list);
        const filtered_sprites = sprites.filter(({ scene }) =>
          scene_set.has(scene)
        );
        filtered_sprites.forEach(({ sprite_name, sprite_path, json_path }) => {
          this.total_assets++;
          loading_promises.push(
            this.loadSprite(sprite_name, sprite_path, json_path)
          );
        });
      }

      if (models && Array.isArray(models)) {
        const scene_list = config.data.scenes.map((scene) => scene.name);
        const scene_set = new Set(scene_list);
        const filtered_models = models.filter(({ scene }) =>
          scene_set.has(scene)
        );
        filtered_models.forEach(({ model_name, model_path }) => {
          this.total_assets++;
          loading_promises.push(this.loadGLTF(model_name, model_path));
        });
      }

      await Promise.all(loading_promises);
      this.ready = true;
      return this.cache;
    } catch (err) {
      console.error("Error loading assets:", err);
      return this.cache;
    }
  }

  get(name) {
    return this.cache.get(name);
  }
}
