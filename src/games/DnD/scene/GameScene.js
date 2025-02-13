import * as Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.world = window.game.world;
    this.config = this.world.ecs.game.config;
  }

  preload() {}

  create() {
    const { prefabs } = this.config.data.scenes.find(
      (scene) => scene.name === "GameScene"
    );

    console.log("Loading Prefabs...");
    this.config.data.prefabs.forEach(({ name, components }) => {
      if (prefabs.includes(name)) {
        this.world.createEntity(name, components);
      }
    });
  }

  update(time, delta) {}
}
