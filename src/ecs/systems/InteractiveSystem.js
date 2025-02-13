import System from "../core/System";
import { Interactive } from "../components";

export class InteractiveSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.inputManager;
    this.interactive = game.world.world.createQuery({
      all: [Interactive],
    })._cache;
  }

  handleClick({ x, y }) {
    for (const entity of this.interactive) {
      if (this.isWithinBounds(x, y, entity)) {
        const action = entity.interactive.action.find(
          ({ type }) => type === "click"
        );
        this.triggerAction(action.action_type);
        break;
      }
    }
  }

  handleHover({ x, y }) {
    for (const entity of this.interactive) {
      if (this.isWithinBounds(x, y, entity)) {
        entity.fireEvent("hover");
        this.game.canvas.style.cursor = "pointer";
        const action = entity.interactive.action.find(
          ({ type }) => type === "onHover"
        );
        this.triggerAction(action.action_type);
      } else {
        entity.fireEvent("off-hover");
        this.game.canvas.style.cursor = "default";
        const action = entity.interactive.action.find(
          ({ type }) => type === "offHover"
        );
        this.triggerAction(action.action_type);
      }
    }
  }

  isWithinBounds(x, y, entity) {
    const width = parseInt(entity.style.css.width);
    const height = parseInt(entity.style.css.height);

    const pos = {
      x: this.game.systems
        .get("renderSystem")
        .entity_to_phaser_obj.get(entity.id).list[0].x,
      y: this.game.systems
        .get("renderSystem")
        .entity_to_phaser_obj.get(entity.id).list[0].y,
    };

    return x >= pos.x && x < pos.x + width && y >= pos.y && y < pos.y + height;
  }

  triggerAction(action) {
    switch (action) {
      case typeof action === "function":
        action();
        break;
      default:
        switch (action) {
          case "BACKTOMAIN":
            window.location.href = "/";
            break;
          case "ONHOVER":
            break;
          case "OFFHOVER":
            break;
          default:
            break;
        }
    }
  }

  update(dt) {
    if (!this.inputManager) {
      this.inputManager = this.game.managers.get("inputManager");
      this.inputManager.onClick(this.handleClick, this);
      this.inputManager.onHover(this.handleHover, this);
    }
  }
}
