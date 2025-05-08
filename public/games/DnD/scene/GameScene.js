import { Scene } from "../../../../src/ecs/core/Scene";

export default class GameScene extends Scene {
  constructor(game) {
    super(game);

    this.game = game;
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

    const { x, y } = this.game.managers.get("inputManager").getMouse();

    // const components = [
    //   {
    //     type: "Text",
    //     properties: {
    //       text: "Test",
    //     },
    //   },
    //   {
    //     type: "Position",
    //     properties: {
    //       x: 0,
    //       y: 1,
    //       z: 0,
    //     },
    //   },
    //   {
    //     type: "Button",
    //     properties: {
    //       style: {},
    //     },
    //   },
    //   {
    //     type: "Style",
    //     properties: {
    //       css: {
    //         backgroundColor: "#2fc5f6",
    //         fontFamily: "/assets/fonts/Sweet_Candies.otf",
    //         color: "#ffffff",
    //         fontSize: 0.5,
    //         depth: 0.1,
    //       },
    //     },
    //   },
    //   {
    //     type: "Size",
    //     properties: {
    //       width: 2,
    //       height: 1,
    //     },
    //   },
    //   {
    //     type: "ActionHandler",
    //     properties: {
    //       actions: [
    //         {
    //           action: "changeColor",
    //           payload: { backgroundColor: "#D708F5" },
    //           type: "MOUSEENTER",
    //         },
    //         {
    //           action: "getMouseCoords",
    //           payload: { x: "$mouse.x", y: "$mouse.y" },
    //           type: "CLICK",
    //         },
    //         {
    //           action: "changeColor",
    //           payload: { backgroundColor: "#2fc5f6" },
    //           type: "MOUSELEAVE",
    //         },
    //         {
    //           action: "moveEntity",
    //           payload: { x: "$mouse.x", y: "$mouse.y" },
    //           type: "DRAG",
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     type: "Interactive",
    //   },
    //   {
    //     type: "Renderable",
    //     properties: {
    //       type: "mesh",
    //       layer: "ui",
    //     },
    //   },
    // ];
    // this.world.createEntity("Test_Button", components);
  }

  update(time, delta) {}
}
