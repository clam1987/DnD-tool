import Manager from "./Manager";
import EventEmitter from "events";
import { Interactive } from "../components";
import { CLICK } from "../../utils/actions";
export class InputManager extends Manager {
  #eventEmitter;
  constructor(game) {
    super(game);

    this.keys = {};
    this.combos = {};
    this.input_stack = [];
    this.action_in_progress = false;
    this.mouse = {
      x: 0,
      y: 0,
    };

    this.keyStates = {
      move_up: false,
      move_down: false,
      move_left: false,
      move_right: false,
    };
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
      });
    });
  }

  getMouse() {
    return this.mouse;
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

  useInputType(input) {
    const index = this.input_stack.indexOf(input);
    if (index !== -1) {
      this.input_stack.splice(index, 1);
    }
  }

  destroy(canvas) {
    canvas.removeEventListener("click");
  }
}
