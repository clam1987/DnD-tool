import System from "../core/System";
import { Text, Sprite, Button } from "../components";

export class RenderSystem extends System {
  constructor(game) {
    super(game);
    this.entity_to_phaser_obj = new Map();
    this.game = game;
    this.sprites = game.world.world.createQuery({
      all: [Sprite],
    })._cache;
    this.text = game.world.world.createQuery({
      all: [Text],
      none: [Button],
    })._cache;
    this.button = game.world.world.createQuery({
      all: [Button, Text],
    })._cache;
  }

  onSceneChange() {}

  createPhaserText(entity) {
    const scene_manager = this.game.managers.get("sceneManager");
    const scene = scene_manager.getScene(scene_manager.current_scene);
    const phaser_text = scene.add.text(
      entity.position.x,
      entity.position.y,
      entity.text.text,
      { ...entity.text.style, fontSize: 48 }
    );
    this.entity_to_phaser_obj.set(entity.id, phaser_text);
  }

  updatePhaserText(entity, text) {}

  createPhaserButton(entity) {
    const scene_manager = this.game.managers.get("sceneManager");
    const scene = scene_manager.getScene(scene_manager.current_scene);
    let posX = 0;
    let posY = 0;
    const {
      text: { style: txt_style, text },
      style: { css },
      position: { x, y },
    } = entity;
    const canvas_width = scene.renderer.width;
    const canvas_height = scene.renderer.height;

    const button = scene.add.container(0, 0);
    if (typeof x === "string") {
      posX = (1 - parseFloat(x) / 100) * canvas_width - x / 2;
    } else {
      posX = x;
    }

    if (typeof y === "string") {
      posY = (1 - parseFloat(y) / 100) * canvas_height - y / 2;
    } else {
      posY = y;
    }

    const bg = scene.add.graphics();
    bg.clear();
    bg.fillStyle(css.backgroundColor, 1);
    bg.fillRoundedRect(0, 0, css.width, css.height, 32);
    bg.setPosition(Math.round(posX), Math.round(posY));

    const button_text = scene.add.text(0, 0, text, {
      ...txt_style,
    });
    const text_offset_x = (css.width - button_text.width) / 2;
    const text_offset_y = (css.height - button_text.height) / 2;

    button_text.setPosition(posX + text_offset_x, posY + text_offset_y);

    button.add([bg, button_text]);
    entity.fireEvent("set-position", {
      x: Math.round(posX),
      y: Math.round(posY),
    });
    this.entity_to_phaser_obj.set(entity.id, button);
  }

  updatePhaserButton(entity) {
    const current_entity = this.entity_to_phaser_obj.get(entity.id);
    if (!current_entity) return;

    const is_hovering = entity.interactive.hovering;

    if (entity.interactive.prev_hover !== is_hovering) {
      current_entity.list[0].clear();

      if (is_hovering) {
        current_entity.list[0].fillStyle(
          entity.style.hover_style.backgroundColor,
          1
        );
        current_entity.list[1].setColor(entity.style.hover_style.color);
      } else {
        current_entity.list[0].fillStyle(entity.style.css.backgroundColor, 1);
        current_entity.list[1].setColor(entity.style.css.color);
      }

      current_entity.list[0].fillRoundedRect(
        0,
        0,
        entity.style.css.width,
        entity.style.css.height,
        32
      );

      entity.interactive.prev_hover = is_hovering;
    }
  }

  update(dt) {
    if (this.text.length > 0) {
      for (const text_entity of this.text) {
        if (!this.entity_to_phaser_obj.has(text_entity.id)) {
          this.createPhaserText(text_entity);
        } else {
          this.updatePhaserText(text_entity);
        }
      }
    }

    if (this.button.length > 0) {
      for (const button_entity of this.button) {
        if (!this.entity_to_phaser_obj.has(button_entity.id)) {
          this.createPhaserButton(button_entity);
        } else {
          this.updatePhaserButton(button_entity);
        }
      }
    }
  }
}
