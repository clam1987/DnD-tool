import System from "../core/System";
import { AnimationState, Renderable, GltfAnimation } from "../components";

export class AnimationSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.asset_manager = null;
    this.config_animations = game.config.data.assets.animations;
    this.sprite_animations = game.world.world.createQuery({
      all: [Renderable, AnimationState],
    })._cache;
    this.model_animations = game.world.world.createQuery({
      all: [GltfAnimation],
    })._cache;
  }

  update(dt) {
    if (this.asset_manager === null) {
      this.asset_manager = this.game.managers.get("assetLoaderManager");
    } else {
      for (const entity of this.sprite_animations) {
        const sprite_sheet = this.asset_manager.get(
          entity.spriteLoader.spritesheet
        );

        const state = entity.animationState;
        const cfg_anim = this.config_animations[state.current];

        if (!cfg_anim || !sprite_sheet) continue;

        // Special-case logic for idle animations
        if (state.current === "idle") {
          const { direction, previous_animation } = state;
          const name = `${entity.spriteLoader.name}-${direction}`;

          if (
            previous_animation.current !== "idle" ||
            previous_animation.direction !== direction
          ) {
            const frame = sprite_sheet.frames[name];
            if (frame) {
              entity.fireEvent("update-sprite", { frame_data: frame });
            }
          }

          entity.fireEvent("update-current", { current: "idle" });
          entity.fireEvent("update-direction", { direction });
          entity.fireEvent("animation-complete");

          continue;
        }

        if (state.animation_update) {
          const name = cfg_anim.frames[0];
          const frame_0 = sprite_sheet.frames[name];
          if (frame_0) {
            entity.fireEvent("update-frame", { frame: 0 });
            entity.fireEvent("update-sprite", { frame_data: frame_0 });
          }

          entity.fireEvent("animation-complete");

          continue;
        }

        const delta_in_secs = dt / 1000;
        entity.fireEvent("update-time", { time: state.time + delta_in_secs });
        const frame_duration = 1 / cfg_anim.frame_rate;
        let idx = Math.floor(
          (state.time % (cfg_anim.frames.length / frame_duration)) /
            frame_duration
        );
        if (idx >= cfg_anim.frames.length) {
          if (cfg_anim.loop) {
            entity.fireEvent("update-time", {
              time: state.time % (cfg_anim.frames.length * frame_duration),
            });
          } else {
            idx = cfg_anim.frames.length - 1;
            continue;
          }
        }

        if (idx !== state.frame) {
          const frame_data = sprite_sheet.frames[cfg_anim.frames[idx]];
          if (frame_data) {
            entity.fireEvent("update-frame", { frame: idx });
            entity.fireEvent("update-sprite", { frame_data });
          }
        }
      }

      for (const entity of this.model_animations) {
        const animation = entity.gltfAnimation;
        if (animation.mixer) {
          const delta_in_secs = dt / 1000;
          animation.mixer.update(delta_in_secs);
        }
      }
    }
  }
}
