import Manager from "./Manager";
import EventEmitter from "events";
import { Raycaster } from "three";
import { Clickable } from "../components";
export class InputManager extends Manager {
  #eventEmitter;
  constructor(game) {
    super(game);

    this.keys = {};
    this.combos = {};
    this.input_stack = [];
    this.action_in_progress = false;

    this.keyStates = {
      move_up: false,
      move_down: false,
      move_left: false,
      move_right: false,
    };
    this.#eventEmitter = new EventEmitter();

    // this.clickable = this.game.world.createQuery({
    //   all: [Clickable],
    // })._cache;
  }

  initialize(canvas) {
    canvas.addEventListener("click", (evt) => {
      const rect = canvas.getBoundingClientRect();

      const mouse = {
        x: ((evt.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((evt.clientY - rect.top) / rect.height) * 2 + 1,
      };

      const raycaster = new Raycaster();
      const camera = this.game.managers.get("sceneManager").getCamera();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(
        this.game.managers.get("sceneManager").getScene().children,
        true
      );
      console.log(this.game.managers.get("sceneManager").getScene().children);
      console.log(intersects);
      // if (intersects.length > 0) {
      //   const { x, y, z } = intersects[0].point;
      //   this.#eventEmitter.emit("click", { x, y, z });
      // }
    });
  }

  checkForStopMovement() {
    const allKeysReleased = Object.values(this.keyStates).every(
      (state) => !state
    );
    const actionSystem = this.game.systems.get("actionSystem");
    if (actionSystem) {
      if (allKeysReleased && !this.action_in_progress) {
        this.#eventEmitter.emit("stopMovement");
      }
    }
  }

  onStopMovement(callback, context) {
    this.#eventEmitter.on("stopMovement", callback, context);
  }

  offStopMovement(callback, context) {
    this.#eventEmitter.off("stopMovement", callback, context);
  }

  actionComplete() {
    this.action_in_progress = false;
  }

  actionInProgress() {
    this.action_in_progress = true;
  }

  registerCombo(name, keys) {
    this.combos[name] = keys;
  }

  checkCombos() {
    for (let combo in this.combos) {
      const keys = this.combos[combo];
      if (keys.every((key) => this.keys[key])) {
        return combo;
      }
    }

    return null;
  }

  getInputs() {
    const commands = [];
    const allKeysReleased = Object.values(this.keyStates).every(
      (state) => !state
    );

    if (this.keys.move_up.isDown && !this.action_in_progress) {
      commands.push({ type: "movement", direction: "back" });
    }
    if (this.keys.move_down.isDown && !this.action_in_progress) {
      commands.push({ type: "movement", direction: "front" });
    }
    if (this.keys.move_left.isDown && !this.action_in_progress) {
      commands.push({ type: "movement", direction: "left" });
    }
    if (this.keys.move_right.isDown && !this.action_in_progress) {
      commands.push({ type: "movement", direction: "right" });
    }

    if (this.keys.attack.isDown && allKeysReleased) {
      commands.push({ type: "action", direction: "" });
    }

    if (this.keys.debug.isDown && allKeysReleased) {
      commands.push({ type: "debug", direction: "" });
    }

    return commands;
  }

  onClick(callback, context) {
    this.#eventEmitter.on("click", callback, context);
  }

  offClick(callback, context) {
    this.#eventEmitter.off("click", callback, context);
  }

  onHover(callback, context) {
    this.#eventEmitter.on("hover", callback, context);
  }

  offHover(callback, context) {
    this.#eventEmitter.off("hover", callback, context);
  }

  destroy() {}
}
