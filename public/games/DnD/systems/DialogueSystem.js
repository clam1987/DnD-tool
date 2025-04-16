import System from "../../../../src/ecs/core/System";

export class DialogueSystem extends System {
  constructor(game) {
    super(game);
    this.game = game;
  }

  update(dt) {}
}
