import Manager from "./Manager";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import path from "path";

export class AssetLoaderManager extends Manager {
  constructor(game) {
    super(game);

    this.cache = new Map();
  }

  async loadSprite(name, asset_path, json_path) {
    if (this.cache.has(name)) return this.cache.get(name);

    // console.log(__dirname);

    const texture = await new Promise((res, rej) => {
      const loader = new TextureLoader();
      loader.load(
        `/games/${this.game.config.name}${asset_path}`,
        res,
        undefined,
        rej
      );
    });
    this.cache.set(name, texture);

    return texture;
  }

  async loadGLTF(name, asset_path) {
    if (this.cache.has(name)) return this.cache.get(name);

    const loader = new GLTFLoader();
    const gltf = await new Promise((res, rej) => {
      loader.load(path, res, undefined, rej);
    });
    this.cache.set(name, gltf);

    return gltf;
  }

  get(name) {
    return this.cache.get(name);
  }
}
