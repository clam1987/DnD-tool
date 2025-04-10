import System from "../core/System";

export class InputActionSystem extends System {
  constructor(game) {
    super(game);

    this.input_manager = this.game.managers.get("inputManager");
    console.log(this.input_manager);
  }
}
