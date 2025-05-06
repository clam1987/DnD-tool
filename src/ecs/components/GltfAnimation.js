import { Component } from "geotic";
import { AnimationMixer, AnimationAction } from "three";

export class GltfAnimation extends Component {
  constructor({ clips, mixer_root }) {
    super();

    this.clips = clips ?? [];
    this.mixer_root = mixer_root ?? null;
    this.mixer = null;
    this.actions = {};
    this.current = null;
  }

  onCreateAnimation(evt) {
    if (!this.mixer_root) {
      console.warn("GltfAnimation: no mixer_root provided—will not animate");
      return evt.handle();
    }

    this.mixer = new AnimationMixer(this.mixer_root);

    for (const clip of this.clips) {
      const action = this.mixer.clipAction(clip);
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.paused = true;
      this.actions[clip.name] = action;
    }

    evt.handle();
  }

  onUpdateGltfCurrent(evt) {
    const { current } = evt.data;
    this.play(current);
    evt.handle();
  }

  play(name) {
    const next = this.actions[name];
    if (!next) {
      console.warn(`GltfAnimation: clip "${name}" not found`);
      return;
    }

    if (this.current && this.actions[this.current]) {
      this.actions[this.current].fadeOut(0.2);
    }

    next.reset().fadeIn(1).play();
    this.current = name;
  }
}
