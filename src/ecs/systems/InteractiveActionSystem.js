import { Raycaster, Vector3, Plane } from "three";
import System from "../core/System";
import {
  ActionHandler,
  Hover,
  Interactive,
  Renderable,
  Drag,
  Position,
} from "../components";
import { CLICK, DRAG, DROP, MOUSEENTER, MOUSELEAVE } from "../../utils/actions";

export class InteractiveActionSystem extends System {
  constructor(game) {
    super(game);

    this.raycaster = new Raycaster();
    this.hovered_entity = null;
    this.dragged_entity = null;
    this.drag_plane = null;
    this.game = game;
    this.input_manager = null;
    this.did_drag = false;
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
    console.log(trigger_type);
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
    if (!this.input_manager) return;

    const camera = this.#getManager("sceneManager").getCamera();
    if (!camera) return;

    const mouse_ndc = this.input_manager.getMouse(); // normalized device coords
    this.raycaster.setFromCamera(mouse_ndc, camera);
    const ray = this.raycaster.ray;

    const left_click_down = this.input_manager.mouseDown()?.mouse.left_clicked;

    // 🟢 Start Drag
    if (left_click_down && !this.dragged_entity) {
      const entity = this.hovered_entity;
      if (entity && entity.has(Position)) {
        const entity_pos = entity.position.coords.clone();

        // Create a plane perpendicular to camera direction passing through entity position
        const normal = camera.getWorldDirection(new Vector3()).normalize();
        const constant = -normal.dot(entity_pos);
        this.drag_plane = new Plane(normal, constant);

        // Project mouse ray to plane and calculate offset
        const intersection_point = new Vector3();
        ray.intersectPlane(this.drag_plane, intersection_point);

        const offset = new Vector3().subVectors(entity_pos, intersection_point);

        entity.add(Drag);
        entity.fireEvent("drag-start", { mouse: intersection_point, offset });
        this.dragged_entity = entity;
        document.body.style.cursor = "grabbing";
      }
    }

    // 🔁 Continue Drag
    if (this.dragged_entity?.drag?.active && left_click_down) {
      const drag = this.dragged_entity.drag;
      const point = new Vector3();
      ray.intersectPlane(this.drag_plane, point);

      if (point) {
        const new_pos = new Vector3().copy(point).add(drag.offset);
        this.dragged_entity.fireEvent("move-position", { mouse: new_pos });
        this.did_drag = true;
      }
    }

    // 🔴 End Drag
    if (this.dragged_entity && !left_click_down) {
      this.dragged_entity.fireEvent("drag-end");
      this.dragged_entity.remove(this.dragged_entity.drag);
      this.dragged_entity = null;
      this.drag_plane = null;
      document.body.style.cursor = "default";
    }
  }

  #handleClick(entity, context) {
    if (this.did_drag) {
      this.did_drag = false;
      return;
    }
    const click_input = this.input_manager.findInput(CLICK);
    if (click_input) {
      const now = performance.now();
      if (now - click_input.timestamp < 150) {
        this.#processEntityAction(entity, click_input.type, context);
      }
      this.input_manager.useInputType(click_input); // Always pop stale or fresh input
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

  #handleInputs(dt) {
    if (!this.input_manager) {
      this.input_manager = this.#getManager("inputManager");
      return;
    }

    const scene_manager = this.#getManager("sceneManager");
    const mouse = this.input_manager.getMouse();
    const camera = scene_manager.getCamera();
    const scene = scene_manager.getScene();
    const left_click_down = this.input_manager.mouseDown()?.mouse.left_clicked;

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
        if (left_click_down) {
          this.#handleDrag(dt);
        }
        // this.#clearDrag(dt);
      }
    } else {
      this.#clearHover(context);
    }

    // Optional: Clear remaining stale inputs
    // this.input_manager.clearInputStack();
  }

  update(dt) {
    this.did_drag = false;
    this.#handleInputs(dt);

    if (
      this.dragged_entity &&
      !this.input_manager.mouseDown()?.mouse.left_clicked
    ) {
      this.dragged_entity.fireEvent("drag-end");
      this.dragged_entity.remove(this.dragged_entity.drag);
      this.dragged_entity = null;
      document.body.style.cursor = "default";
    }
  }
}
