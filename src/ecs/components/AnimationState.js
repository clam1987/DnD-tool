import { Component } from "geotic";

export class AnimationState extends Component {
  constructor({ current, frame, time, direction }) {
    super();

    this.current = current || "idle"; // The current animation state
    this.frame = frame || 0; // The current frame of the animation
    this.time = time || 0; // The time elapsed in the current animation
    this.direction = direction || "front";
    this.previous_animation = { current: null, direction: null };
  }

  onUpdateTime(evt) {
    const { time } = evt.data;
    this.time = time;
    evt.handle();
  }

  onUpdateCurrent(evt) {
    const { current } = evt.data;

    if (this.current !== current) {
      this.previous_animation = {
        ...this.previous_animation,
        current: this.current,
      };
      this.current = current;
      this.time = 0;
      this.frame = 0;
    }
    evt.handle();
  }

  onUpdateFrame(evt) {
    const { frame } = evt.data;
    this.frame = frame || this.frame;

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
    }

    evt.handle();
  }
}
