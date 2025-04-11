import System from "../core/System";
import { ActionHandler } from "../components";
import { CLICK } from "../../utils/actions";

export class InputActionSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.input_manager = null;
    this.action_handler = game.world.world.createQuery({
      all: [ActionHandler],
    })._cache;
  }

  #processAction(input_stack) {
    const input_action = input_stack.shift();
    const { action, entity, payload, type } = input_action;
    // console.log(type);
    switch (type) {
      case CLICK:
        if (this.game.action_registry.has(action)) {
          this.game.action_registry.execute(action, entity, payload);
        }
        break;
      default:
        console.error("No matching types found!");
        break;
    }
  }

  update(dt) {
    if (!this.input_manager) {
      this.input_manager = this.game.managers.get("inputManager");
    } else {
      if (this.input_manager.getInputStack().length > 0) {
        this.#processAction(this.input_manager.getInputStack());
      }
    }
  }
}
