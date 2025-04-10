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
