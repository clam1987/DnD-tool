import System from "../core/System";
import { KEYDOWN } from "../../utils/actions";
import { Player, Velocity, ActionHandler } from "../components";
import { Vector3 } from "three";

export class InputActionSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.input_manager = null;
    this.player = game.world.world.createQuery({
      all: [Player, ActionHandler],
    })._cache;
  }

  #processInputAction(trigger_type, entity) {
    const actions = entity.actionHandler?.actions ?? [];
    for (const { action, payload, type } of actions) {
      if (trigger_type === type && this.game.action_registry.has(action)) {
        const resolved_payload = this.#resolvePayload(payload, entity);
        const input_manager = this.game.managers.get("inputManager");
        this.game.action_registry.execute(action, entity, resolved_payload, {
          input_manager,
        });
      }
    }
  }

  #resolvePayload(payload, entity) {
    const resolved = {};
    for (const key in payload) {
      const value = payload[key];
      if (typeof value === "string" && value.startsWith("$")) {
        const path = value.slice(1).split(".");
        let ref = entity; // Start the reference from the entity
        for (const part of path) {
          ref = ref?.[part];
        }
        resolved[key] = ref;
      } else {
        resolved[key] = value;
      }
    }
    return resolved;
  }
  #interpolateMovement(dt) {
    const lerp_factor = Math.min(1.0, dt * 20);

    for (const entity of this.player) {
      if (!entity?.position) continue;

      const pos = entity.position;

      if (!pos.coords.equals(pos.previous_position)) {
        pos.coords.lerp(pos.previous_position, lerp_factor);
      }
    }
  }

  handleInputs(dt) {
    const actions = this.input_manager.getActiveActions();
    if (actions.length === 0) {
      for (const entity of this.player) {
        entity.fireEvent("update-current", { current: "idle" });
        entity.fireEvent("update-direction", {
          direction: entity.animationState.direction,
        });
      }
    } else {
      for (const entity of this.player) {
        this.#processInputAction(KEYDOWN, entity);
      }
    }
  }

  update(dt) {
    if (!this.input_manager) {
      this.input_manager = this.game.managers.get("inputManager");
    } else {
      this.handleInputs(dt);
      this.#interpolateMovement(dt);
    }
  }
}
