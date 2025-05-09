import Manager from "./Manager";

export class SceneManager extends Manager {
  constructor(game) {
    super(game);

    this.current_scene = null;
    this.active_scene = null;
  }

  initialize() {
    this.scene_manager = this.game.phaser.scene;
    this.active_scene = this.scene_manager.getScenes(true);
    this.setScene(this.active_scene[0].sys.config.key);
    this.startScene(this.current_scene);
  }

  setScene(scene) {
    this.current_scene = scene;
  }

  getScene(scene_name) {
    return this.scene_manager.getScene(scene_name);
  }

  startScene(scene) {
    if (!this.scene_manager.getScene(scene).sys.isActive()) {
      this.scene_manager.start(scene);
      console.log(`${scene} started!`);
    }
  }

  changeScene(scene) {}
}
