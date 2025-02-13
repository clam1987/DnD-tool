export default class System {
  #game = null;

  constructor(game) {
    this.#game = game;
    this.phaser_assets_loaded = false;
  }

  initialize() {
    this.phaser_assets_loaded = true;
  }

  destroy() {}

  update(dt) {}
}
