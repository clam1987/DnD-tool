import ECS from "..";
import World from "./World";
import { ActionRegistry } from "./ActionRegistry";
import { RenderSystem, InteractiveSystem, InputActionSystem } from "../systems";
import { SceneManager, InputManager } from "../managers";

export default class Game {
  #last_update;

  constructor(config, canvas_ref) {
    this.config = config;
    this.ecs = new ECS(this);
    this.world = new World(this);
    this.systems = new Map();
    this.managers = new Map();
    this.initializeSystems();
    this.initializeManagers();
    this.initialize();
    this.canvas = canvas_ref.current || null;
    this.#last_update = Date.now();
    this.action_registry = ActionRegistry;

    window.game = this;
  }

  async initialize() {
    if (!this.config) return console.error("Incorrect config!");

    this.config.data.prefabs.forEach((prefab) => {
      this.ecs.engine.registerPrefab(prefab);
    });

    const systems = await this.loadSystems();
    systems.forEach((system) => {
      this.systems.set(system.name, new system(this));
    });

    this.registerDefaultActions();
    await this.registerCustomAction();

    // console.log(this.managers.get("sceneManager"));
  }

  initializeSystems() {
    this.systems.set("renderSystem", new RenderSystem(this));
    // this.systems.set("interactiveSystem", new InteractiveSystem(this));
    this.systems.set("inputActionSystem", new InputActionSystem(this));
  }

  initializeManagers() {
    this.managers.set("sceneManager", new SceneManager(this));
    this.managers.set("inputManager", new InputManager(this));
  }

  async loadSystems() {
    if (!this.config.data.systems || this.config.data.systems.length === 0)
      return [];

    const systems = await Promise.all(
      this.config.data.systems.map(async (system) => {
        try {
          const module = await import(
            `../../games/${this.config.name}/systems/${system.name}`
          );

          return module.default || module;
        } catch (err) {
          console.error("Error loading system:", err);
          return null;
        }
      })
    );

    return systems.filter(Boolean);
  }

  registerDefaultActions() {
    ActionRegistry.register("changeColor", (entity, payload) => {
      const mesh = entity.renderable.group;
      if (mesh) {
        const current_color = mesh.material.color.getHex();
        mesh.material.color.set(
          current_color === "#2fc5f6" ? "#ffffff" : "#2fc5f6"
        );
      }
    });

    ActionRegistry.register("goToScene", (entity, payload) => {
      this.managers.get("sceneManager").loadScene(payload.scene);
    });

    ActionRegistry.register("getMouseCoords", (entity, payload) => {
      const { x, y, z } = payload;
      entity.fireEvent("click", { x, y, z });
    });

    ActionRegistry.register("backToHome", (entity, payload) => {
      const { url } = payload;
      window.location.href = url;
    });
  }

  async registerCustomAction() {
    if (
      !this.config.data.custom_scripts ||
      this.config.data.custom_scripts.length < 1
    ) {
      return [];
    } else {
      await Promise.all(
        this.config.data.custom_scripts.map(async (script) => {
          try {
            const module = await import(
              `../../games/${this.config.name}/scripts/${script}.js`
            );

            this.action_registry.register(script, module.default || module);
          } catch (err) {
            console.error("Error loading system:", err);
            return null;
          }
        })
      );
    }
  }

  start() {
    this.#last_update = Date.now();
    this.runtime = this.runtime.bind(this);
    this.managers
      .get("sceneManager")
      .initialize(this.canvas, this.config.data.scenes);
    this.managers.get("inputManager").initialize(this.canvas);
    this.runtime();
  }

  update(dt) {
    this.world.update(dt);
    this.systems.forEach((system) => {
      system.update(dt);
    });
  }

  runtime() {
    requestAnimationFrame(this.runtime);
    const now = Date.now();
    const dt = now - this.#last_update;
    this.update(dt);
    this.#last_update = now;
  }

  destroy() {
    this.world.destroyWorld();
  }
}
