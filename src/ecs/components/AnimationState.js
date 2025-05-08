import { Component } from "geotic";

export class AnimationState extends Component {
  constructor({ current, frame, time, direction }) {
    super();

    this.current = current || "idle"; // The current animation state
    this.frame = frame || 0; // The current frame of the animation
    this.time = time || 0; // The time elapsed in the current animation
    this.direction = direction || "front";
    this.previous_animation = { current: null, direction: null };
    this.animation_update = false;
  }

  onUpdateTime(evt) {
    const { time } = evt.data;
    this.time = time;
    evt.handle();
  }

  onUpdateCurrent(evt) {
    const { current } = evt.data;

    if (this.entity.spriteLoader) {
      if (this.current !== current) {
        this.previous_animation = {
          ...this.previous_animation,
          current: this.current,
        };
        this.current = current;
        this.time = 0;
        this.frame = 0;
        this.animation_update = true;
      }
    }

    evt.handle();
  }

  onUpdateFrame(evt) {
    const { frame } = evt.data;
    this.frame = frame || this.frame;
    this.animation_update = false;

    evt.handle();
  }

  onUpdateDirection(evt) {
    const { direction } = evt.data;
    if (this.direction !== direction) {
      this.previous_animation = {
        ...this.previous_animation,
        direction: this.direction,
      };
      this.direction = direction;
      this.animation_update = true;
    }

    evt.handle();
  }

  onAnimationComplete(evt) {
    this.animation_update = false;
    evt.handle();
  }
}

/* Keeping here as a reference to 2d animations structure
"animations": {
        "idle": {
          "frames": ["lufia-front", "lufia-back", "lufia-left", "lufia-right"],
          "frame_rate": 4,
          "loop": false,
          "current_frame": 0,
          "time_since_last_frame": 0
        },
        "back_walk": {
          "frames": [
            "lufia-back-walk.000",
            "lufia-back-walk.001",
            "lufia-back-walk.002",
            "lufia-back-walk.003",
            "lufia-back-walk.004",
            "lufia-back-walk.005",
            "lufia-back-walk.006",
            "lufia-back-walk.007"
          ],
          "frame_rate": 8,
          "loop": true,
          "current_frame": 0,
          "time_since_last_frame": 0
        },
        "front_walk": {
          "frames": [
            "lufia-front-walk.000",
            "lufia-front-walk.001",
            "lufia-front-walk.002",
            "lufia-front-walk.003",
            "lufia-front-walk.004",
            "lufia-front-walk.005",
            "lufia-front-walk.006",
            "lufia-front-walk.007"
          ],
          "frame_rate": 8,
          "loop": true,
          "current_frame": 0,
          "time_since_last_frame": 0
        },
        "left_walk": {
          "frames": [
            "lufia-left-walk.000",
            "lufia-left-walk.001",
            "lufia-left-walk.002",
            "lufia-left-walk.003",
            "lufia-left-walk.004",
            "lufia-left-walk.005",
            "lufia-left-walk.006",
            "lufia-left-walk.007"
          ],
          "frame_rate": 8,
          "loop": true,
          "current_frame": 0,
          "time_since_last_frame": 0
        },
        "right_walk": {
          "frames": [
            "lufia-right-walk.000",
            "lufia-right-walk.001",
            "lufia-right-walk.002",
            "lufia-right-walk.003",
            "lufia-right-walk.004",
            "lufia-right-walk.005",
            "lufia-right-walk.006",
            "lufia-right-walk.007"
          ],
          "frame_rate": 8,
          "loop": true,
          "current_frame": 0,
          "time_since_last_frame": 0
        }
      },
*/
