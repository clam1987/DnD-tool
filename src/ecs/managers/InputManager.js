import Manager from "./Manager";
import EventEmitter from "events";
import { Raycaster } from "three";
import { Clickable } from "../components";
import { CLICK } from "../../utils/actions";
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

    this.clickable = this.game.world.world.createQuery({
      all: [Clickable],
    })._cache;
  }

  initialize(canvas) {
    canvas.addEventListener("click", (evt) => {
      const rect = canvas.getBoundingClientRect();

      const mouse = {
        x: ((evt.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((evt.clientY - rect.top) / rect.height) * 2 + 1,
      };

      const raycaster = new Raycaster();
      const camera = this.game.managers.get("sceneManager").getCamera();
      raycaster.setFromCamera(mouse, camera);

      const scene = this.game.managers.get("sceneManager").getScene();
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        let object = intersect.object;
        const entity = this.clickable.find(
          (entity) => entity.renderable.group.uuid === object.parent.uuid
        );
        this.input_stack.push({
          type: CLICK,
          entity,
          payload: {
            x: intersect.point.x,
            y: intersect.point.y,
            z: intersect.point.z,
          },
        });
        entity.fireEvent("click", {
          x: intersect.point.x,
          y: intersect.point.y,
          z: intersect.point.z,
        });
      }
    });
  }

  getInputStack() {
    return this.input_stack;
  }

  destroy() {}
}
