import { Vector3 } from "three";

const action_registry = new Map();

export const ActionRegistry = {
  register(name, fn) {
    if (action_registry.has(name)) {
      console.warn(`Action: ${name}, already exists. Overwriting`);
    }
    action_registry.set(name, fn);
  },
  execute(name, entity, payload) {
    const fn = action_registry.get(name);
    if (!fn) {
      console.warn(`Action ${name}, does not exist in registry.`);
      return;
    }

    fn(entity, payload);
  },
  clear() {
    action_registry.clear();
  },
  has(name) {
    return action_registry.has(name);
  },
  get() {
    return action_registry;
  },
};

export function registerDefaultActions() {
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
    const { x, y } = payload;
    console.log(`Mouse Coords: ${x}, ${y}`);
  });

  ActionRegistry.register("changeURL", (entity, payload) => {
    const { url } = payload;
    window.location.href = url;
  });

  ActionRegistry.register("moveEntity", (entity, payload) => {
    if (!entity.position || !entity.renderable) return;

    const { x, y, z } = payload;

    const new_pos = new Vector3(x, y, z);

    entity.position.coords.copy(new_pos);

    entity.renderable.group.position.copy(new_pos);
  });
}
