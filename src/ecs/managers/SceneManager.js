import Manager from "./Manager";
import * as THREE from "three";

export class SceneManager extends Manager {
  constructor(game) {
    super(game);

    this.current_scene = null;
    this.renderer = null;
    this.camera = null;
    this.scene_manager = new Map();
  }

  async initialize(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor("#878787");

    window.addEventListener("resize", this.onResize);
    await this.loadScene(this.game.config.data.scenes[0]);
  }

  /* might need in the future */
  // async loadScenes() {
  //   const scenes = await Promise.all(
  //     this.game.config.data.scenes.map(async (scene) => {
  //       const module = await import(
  //         `../../games/${this.game.config.name}/scene/${scene.name}`
  //       );

  //       return module.default || module;
  //     })
  //   );

  //   console.log(scenes[0].prototype);

  //   return scenes;
  // }

  async loadScene(scene) {
    const { name } = scene;
    if (this.scene_manager.has(name)) {
      this.changeScene(name);
      return;
    }

    try {
      const scene_module = await import(
        `../../../public/games/${this.game.config.name}/scene/${name}`
      );
      const scene_instance = new scene_module.default(this.game);
      const scene_obj = new THREE.Scene();

      this.scene_manager.set(name, {
        scene: scene_obj,
        logic: scene_instance,
      });

      this.changeScene(name);
    } catch (err) {
      console.error(`Error loading scene ${name}:`, err);
    }
  }

  onResize = () => {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  changeScene(name) {
    const found = this.scene_manager.get(name);
    if (!found) {
      console.error(`Scene ${name} not found`);
      return;
    }

    this.current_scene = found.scene;

    if (typeof found.logic.start === "function") {
      found.logic.start();
    }
  }

  getScene() {
    return this.current_scene;
  }

  getCamera() {
    return this.camera;
  }

  setCamera(camera) {
    this.camera = camera;
  }

  getRenderer() {
    return this.renderer;
  }
}
