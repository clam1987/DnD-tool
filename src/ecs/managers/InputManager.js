import EventEmitter from "events";
import { Vector3 } from "three";
import Manager from "./Manager";
import { Interactive } from "../components";
import {
  CLICK,
  MOVE_BACKWARD,
  MOVE_FORWARD,
  MOVE_LEFT,
  MOVE_RIGHT,
  KEYDOWN,
  KEYUP,
} from "../../utils/actions";
export class InputManager extends Manager {
  #eventEmitter;
  constructor(game) {
    super(game);

    this.combos = {};
    this.input_stack = [];
    this.action_in_progress = false;
    this.mouse = {
      x: 0,
      y: 0,
      left_clicked: false,
      right_clicked: false,
      middle_clicked: false,
      last_mouse_down: 0,
      last_mouse_up: 0,
    };

    this.key_map = {
      KeyW: MOVE_FORWARD,
      KeyA: MOVE_LEFT,
      KeyS: MOVE_BACKWARD,
      KeyD: MOVE_RIGHT,
    };
    this.active_keys = new Set();
    this.#eventEmitter = new EventEmitter();

    this.interactive = this.game.world.world.createQuery({
      all: [Interactive],
    })._cache;
  }

  initialize(canvas) {
    canvas.addEventListener("mousemove", (evt) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
    });

    canvas.addEventListener("click", (evt) => {
      this.input_stack.push({
        type: CLICK,
        mouse: this.mouse,
        timestamp: performance.now(),
        evt,
      });
    });

    canvas.addEventListener("mousedown", (evt) => {
      if (evt.button === 0) {
        this.mouse.left_clicked = true;
      }
      if (evt.button === 1) {
        this.mouse.middle_clicked = true;
      }
      if (evt.button === 2) {
        this.mouse.right_clicked = true;
      }
    });

    canvas.addEventListener("mouseup", (evt) => {
      if (evt.button === 0) {
        this.mouse.left_clicked = false;
      }
      if (evt.button === 1) {
        this.mouse.middle_clicked = false;
      }
      if (evt.button === 2) {
        this.mouse.right_clicked = false;
      }
    });

    canvas.addEventListener("keydown", (evt) => this.onKeyDown(evt));
    canvas.addEventListener("keyup", (evt) => this.onKeyUp(evt));
  }

  getMouse() {
    return this.mouse;
  }

  getMouseInWorld(camera) {
    return new Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(camera);
  }

  getInputStack() {
    return this.input_stack;
  }

  pushInputStack(input) {
    this.input_stack.push(input);
  }

  popInputStack() {
    return this.input_stack.shift();
  }

  clearInputStack() {
    this.input_stack = [];
  }

  findInput(type) {
    return this.input_stack.find((input) => input.type === type);
  }

  mouseDown() {
    for (const key in this.mouse) {
      if (this.mouse.hasOwnProperty(key)) {
        if (this.mouse[key] === true) {
          return { key: key, value: this.mouse[key] };
        }
      }
    }
    return null;
  }

  useInputType(input) {
    const index = this.input_stack.indexOf(input);
    if (index !== -1) {
      this.input_stack.splice(index, 1);
    }
  }

  onKeyDown(e) {
    this.active_keys.add(e.code);
  }

  onKeyUp(e) {
    this.active_keys.delete(e.code);
  }

  getActiveKeys() {
    return Array.from(this.active_keys);
  }

  destroy(canvas) {
    canvas.removeEventListener("click");
    canvas.removeEventListener("mousedown");
    canvas.removeEventListener("mouseup");
  }
}
