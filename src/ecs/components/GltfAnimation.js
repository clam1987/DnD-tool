import { Component } from "geotic";
import { AnimationMixer, LoopOnce, LoopRepeat } from "three";

export class GltfAnimation extends Component {
  constructor({ clips, mixer_root }) {
    super();

    this.clips = clips ?? [];
    this.mixer_root = mixer_root ?? null;
    this.mixer = null;
    this.actions = {};
    this.current_clip = null;
    this.state = null;
  }

  onCreateAnimation(evt) {
    if (!this.mixer_root) {
      console.warn("GltfAnimation: no mixer_root provided—will not animate");
      return evt.handle();
    }

    this.mixer = new AnimationMixer(this.mixer_root);

    for (const clip of this.clips) {
      const action = this.mixer.clipAction(clip);
      action.paused = true;
      this.actions[clip.name] = action;
    }

    evt.handle();
  }

  onUpdateGltfCurrent(evt) {
    const { state, clip_name, loop } = evt.data;
    this.playClip(state, clip_name, loop);
    evt.handle();
  }

  playClip(state, clip_name, loop) {
    const action = this.actions[clip_name];
    if (this.state === state && this.current_clip === clip_name) return;

    if (!action) {
      console.warn(`GltfAnimation: clip "${clip_name}" not found`);
      return;
    }

    if (this.current_clip && this.actions[this.current_clip]) {
      this.actions[this.current_clip].fadeOut(0.2);
    }

    action
      .reset()
      .setLoop(loop ? LoopRepeat : LoopOnce, Infinity)
      .fadeIn(0.2)
      .play();
    this.current_clip = clip_name;
    this.state = state;
  }
}
