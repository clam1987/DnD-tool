import * as Phaser from "phaser";

export default {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game-container",
    width: window.innerWidth,
    height: window.innerHeight,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoFocus: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
};
