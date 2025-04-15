import { Raycaster, Vector3, Vector2, Plane } from "three";
import System from "../core/System";
import {
  ActionHandler,
  Hover,
  Interactive,
  Renderable,
  Drag,
  Position,
} from "../components";
import { CLICK, MOUSEENTER, MOUSELEAVE } from "../../utils/actions";

export class InteractiveActionSystem extends System {
  constructor(game) {
    super(game);

    this.drag_plane = new Plane(new Vector3(0, 0, 1), 0); // z = 0
    this.drag_intersection = new Vector3();
    this.mouse_ndc = new Vector2();
    this.suppress_next_click = false;
    this.raycaster = new Raycaster();
    this.hovered_entity = null;
    this.dragged_entity = null;
    this.drag_end_dt = null;
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
    if (!this.input_manager) return;

    const camera = this.#getManager("sceneManager").getCamera();
    if (!camera) return;

    const mouse_ndc = this.input_manager.getMouse(); // Vector2 [-1, 1]
    this.raycaster.setFromCamera(mouse_ndc, camera);
    const ray = this.raycaster.ray;

    const left_down = this.input_manager.mouseDown();

    // 🟢 Drag Start
    if (
      left_down?.key === "left_clicked" &&
      left_down?.value &&
      !this.dragged_entity
    ) {
      const entity = this.hovered_entity;
      if (entity && entity.has(Position)) {
        const z_plane = entity.position.coords.z;
        const plane = new Plane(new Vector3(0, 0, 1), -z_plane); // z = plane

        const intersection = new Vector3();
        ray.intersectPlane(plane, intersection);

        const offset = new Vector3().subVectors(
          entity.position.coords,
          intersection
        );

        entity.add(Drag, {
          offset,
          target_position: entity.position.coords.clone(),
          last_mouse: intersection.clone(),
          plane_z: z_plane,
          start_time: performance.now(),
          active: true,
        });

        document.body.style.cursor = "grabbing";
        entity.fireEvent("drag-start", {
          mouse: intersection.clone(),
          offset: offset.clone(),
        });

        this.dragged_entity = entity;
      }
    }

    // 🟡 During Drag
    if (this.dragged_entity?.drag?.active && left_down) {
      const drag = this.dragged_entity.drag;
      const plane = new Plane(new Vector3(0, 0, 1), -drag.plane_z);
      const intersection = new Vector3();

      if (ray.intersectPlane(plane, intersection)) {
        const target_position = new Vector3()
          .copy(intersection)
          .add(drag.offset);
        drag.target_position.copy(target_position);
        drag.last_mouse.copy(intersection);
      }
    }

    // 🟥 Drag End
    if (this.dragged_entity && !left_down?.value) {
      const drag = this.dragged_entity.drag;

      const duration = performance.now() - drag.start_time;

      const long_enough = duration > 150;

      if (long_enough) {
        this.suppress_next_click = true;
      }

      this.dragged_entity.fireEvent("drag-end");
      this.dragged_entity.remove(this.dragged_entity.drag);
      this.dragged_entity = null;
      document.body.style.cursor = "default";
    }
  }

  #interpolateDrag(dt) {
    for (const entity of this.drag) {
      if (!entity.has(Position)) continue;

      const drag = entity.drag;
      const pos = entity.position.coords;
      const target = drag.target_position;

      const lerp_factor = Math.min(1.0, dt * 20);

      pos.lerp(target, lerp_factor);

      entity.fireEvent("move-position", { mouse: pos.clone() });
    }
  }

  #handleClick(entity, context) {
    const click_input = this.input_manager.findInput(CLICK);
    if (click_input) {
      const now = performance.now();
      if (this.suppress_next_click) {
        this.suppress_next_click = false;
        this.input_manager.useInputType(click_input);
        return;
      }

      if (now - click_input.timestamp < 150) {
        this.#processEntityAction(entity, click_input.type, context);
      }

      this.input_manager.useInputType(click_input);
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
        this.#handleDrag(dt);

        this.#handleClick(hit_entity, context);
      }
    } else {
      this.#clearHover(context);
    }
  }

  update(dt) {
    this.#handleInputs(dt);
    this.#interpolateDrag(dt);

    if (this.dragged_entity && !this.input_manager.mouseDown()?.value) {
      const drag = this.dragged_entity.drag;
      const duration = performance.now() - drag.start_time;
      if (duration > 150) {
        this._suppress_next_click = true;
      }
      this.dragged_entity.fireEvent("drag-end");
      this.dragged_entity.remove(this.dragged_entity.drag);
      this.dragged_entity = null;
      document.body.style.cursor = "default";
    }
  }
}
