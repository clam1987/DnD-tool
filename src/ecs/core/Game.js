import * as Phaser from "phaser";
import Phaser_config from "../../utils/configs";
import ECS from "..";
import World from "./World";
import { RenderSystem, InteractiveSystem } from "../systems";
import { SceneManager, InputManager } from "../managers";

export default class Game {
  #last_update;
  phaser;
  scene;

  constructor(config, canvas_ref) {
    this.config = config;
    this.ecs = new ECS(this);
    this.world = new World(this);
    this.systems = new Map();
    this.managers = new Map();
    this.initialize();
    this.initializeSystems();
    this.initializeManagers();
    this.phaser = null;
    this.canvas = canvas_ref.current || null;

    window.game = this;
  }

  async initialize() {
    if (!this.config) return console.error("Incorrect config!");
    this.config.data.prefabs.forEach((prefab) => {
      this.ecs.engine.registerPrefab(prefab);
    });

    const scenes = await this.loadScene();
    this.phaser = new Phaser.Game({
      ...Phaser_config,
      scene: scenes,
    });

    this.phaser.events.on("ready", () => {
      console.log("phaser is ready");
      this.phaser.events.on("step", this.runtime, this);
      this.managers.get("sceneManager").initialize();
      this.managers.get("inputManager").initialize();
    });
  }

  initializeSystems() {
    this.systems.set("renderSystem", new RenderSystem(this));
    this.systems.set("interactiveSystem", new InteractiveSystem(this));
  }

  initializeManagers() {
    this.managers.set("sceneManager", new SceneManager(this));
    this.managers.set("inputManager", new InputManager(this));
  }

  async loadScene() {
    const scene = await Promise.all(
      this.config.data.scenes.map(async (scene) => {
        const module = await import(
          `../../games/${this.config.name}/scene/${scene.name}`
        );

        return module.default || module;
      })
    );

    return scene;
  }

  start() {
    this.#last_update = Date.now();
  }

  update(dt) {
    this.world.update(dt);
    this.systems.forEach((system) => {
      system.update(dt);
    });
  }

  runtime(_, delta) {
    this.update(delta);
    this.#last_update = Date.now();
  }

  destroy() {
    this.world.destroyWorld(this.world);
    this.phaser.destroy(true);
  }
}
