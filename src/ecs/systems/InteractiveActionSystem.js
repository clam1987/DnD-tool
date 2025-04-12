import { Raycaster } from "three";
import System from "../core/System";
import {
  ActionHandler,
  Hover,
  Interactive,
  Renderable,
  Drag,
} from "../components";
import { CLICK, DRAG, DROP, MOUSEENTER, MOUSELEAVE } from "../../utils/actions";

export class InteractiveActionSystem extends System {
  constructor(game) {
    super(game);

    this.raycaster = new Raycaster();
    this.hovered_entity = null;
    this.dragged_entity = null;
    this.game = game;
    this.input_manager = null;
    this.action_handler = game.world.world.createQuery({
      all: [ActionHandler],
    })._cache;
    this.hover = game.world.world.createQuery({
      all: [Hover, Renderable],
    })._cache;
    this.interactive = game.world.world.createQuery({
      all: [Interactive],
    })._cache;
    this.drag = game.world.world.createQuery({
      all: [Drag],
    })._cache;
  }

  #processEntityAction(entity, trigger_type, context) {
    const actions = entity.actionHandler?.actions ?? [];
    for (const { action, payload, type } of actions) {
      if (trigger_type === type && this.game.action_registry.has(action)) {
        const resolved_payload = this.#resolvePayload(payload, context);
        this.game.action_registry.execute(action, entity, resolved_payload);
      }
    }
  }

  #getManager(name) {
    return this.game.managers.get(name);
  }

  #handleHover(entity, context) {
    const is_new_hover = this.hovered_entity !== entity;
    if (is_new_hover) {
      if (this.hovered_entity) {
        this.hovered_entity.fireEvent("leave");
        this.#processEntityAction(this.hovered_entity, MOUSELEAVE, context);
        this.hovered_entity.remove(this.hovered_entity.hover);
      }

      entity.add(Hover);
      entity.fireEvent("enter");

      document.body.style.cursor = "pointer";
      this.hovered_entity = entity;
      this.#processEntityAction(this.hovered_entity, MOUSEENTER, context);
    }
  }

  #clearHover(context) {
    if (this.hovered_entity) {
      this.hovered_entity.fireEvent("leave");
      this.#processEntityAction(this.hovered_entity, MOUSELEAVE, context);
      this.hovered_entity.remove(this.hovered_entity.hover);
      this.hovered_entity = null;
    }
    document.body.style.cursor = "default";
  }

  #handleDrag(dt) {
    if (this.input_manager) {
      const mouse = this.input_manager.getMouse();
      const click_input = this.input_manager.findInput(CLICK);
      const release_input = this.input_manager.findInput(DROP);
      const drag_input = this.input_manager.findInput(DRAG);

      if (!drag_input) return;

      const now = performance.now();
      const click_age = now - drag_input.timestamp;

      if (click_age > 100) {
        this.input_manager.popInputStack();
      }

      const entity = this.hovered_entity;
      if (entity && entity.has(Drag)) {
        if (!entity.has(Drag)) {
          console.log("no drag component");
          entity.add(Drag);
          entity.fireEvent("drag-start", { mouse });
        } else {
          entity.fireEvent("dragging", { mouse, dt });
        }
      }

      // console.log(!this.dragged_entity);
      // console.log(click_input);
      // console.log(this.hovered_entity?.has(Interactive));

      // if (
      //   !this.dragged_entity &&
      //   click_input &&
      //   this.hovered_entity?.has(Interactive)
      // ) {
      //   console.log("Begin dragging");
      // }
    }
  }

  #handleClick(entity, context) {
    const clickInput = this.input_manager.findInput(CLICK);
    if (clickInput) {
      const now = performance.now();
      if (now - clickInput.timestamp < 100) {
        this.#processEntityAction(entity, CLICK, context);
      }
      this.input_manager.popInputStack(); // Always pop stale or fresh input
    }
  }

  #resolvePayload(payload, context) {
    const resolved = {};
    for (const key in payload) {
      const value = payload[key];
      if (typeof value === "string" && value.startsWith("$")) {
        const path = value.slice(1).split(".");
        let ref = context;
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

  #handleInputs() {
    if (!this.input_manager) {
      this.input_manager = this.#getManager("inputManager");
      return;
    }

    const scene_manager = this.#getManager("sceneManager");
    const mouse = this.input_manager.getMouse();
    const camera = scene_manager.getCamera();
    const scene = scene_manager.getScene();

    if (!scene || !camera || !mouse) return;

    this.raycaster.setFromCamera(mouse, camera);
    const intersects = this.raycaster.intersectObjects(scene.children);
    const context = {
      mouse,
      entity: null,
      time: performance.now(),
    };

    let hit_entity = null;
    if (intersects.length > 0) {
      const target_uuid = intersects[0].object.parent.uuid;
      hit_entity = this.interactive.find(
        (e) => e.renderable.group.uuid === target_uuid
      );
    }

    if (hit_entity) {
      context.entity = hit_entity;
      this.#handleHover(hit_entity, context);
      if (hit_entity.has(ActionHandler)) {
        this.#handleClick(hit_entity, context);
      }
    } else {
      this.#clearHover(context);
    }

    // Optional: Clear remaining stale inputs
    // this.input_manager.clearInputStack();
  }

  update(dt) {
    this.#handleInputs();
    this.#handleDrag(dt);
  }
}
