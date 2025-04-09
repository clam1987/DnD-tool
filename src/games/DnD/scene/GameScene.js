import { Scene } from "../../../ecs/core/Scene";

export default class GameScene extends Scene {
  constructor(game) {
    super(game);
    this.world = game.world;
    this.config = game.config;
  }

  start() {
    const { prefabs } = this.config.data.scenes.find(
      (scene) => scene.name === "GameScene"
    );

    console.log("Loading Prefabs...");
    this.config.data.prefabs.forEach(({ name, components }) => {
      if (prefabs.includes(name)) {
        this.world.createEntity(name, components);
      }
    });

    const components = [
      {
        type: "Text",
        properties: {
          text: "Test",
        },
      },
      {
        type: "Position",
        properties: {
          x: 0,
          y: 2,
          z: 0,
        },
      },
      {
        type: "Button",
        properties: {
          style: {},
        },
      },
      {
        type: "Style",
        properties: {
          css: {
            backgroundColor: "#2fc5f6",
            fontFamily: "/assets/fonts/Sweet_Candies_Regular.json",
            color: "#ffffff",
            fontSize: 0.5,
            depth: 0.1,
          },
        },
      },
      {
        type: "Size",
        properties: {
          width: 2,
          height: 1,
        },
      },
      {
        type: "Clickable",
      },
      {
        type: "Renderable",
        properties: {
          type: "mesh",
          layer: "ui",
        },
      },
    ];
    this.world.createEntity("Test_Button", components);
  }

  update(time, delta) {}
}
