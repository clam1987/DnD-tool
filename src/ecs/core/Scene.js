export class Scene {
  constructor(game) {
    this.game = game;
    this.systems = [];
    this.entities = [];
  }

  start() {}

  destroy() {}

  update(dt) {}
}
