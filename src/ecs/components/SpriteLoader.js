import { Component } from "geotic";

export class SpriteLoader extends Component {
  constructor({ frame, name, spritesheet }) {
    super();

    this.frame = frame ?? null;
    this.name = name ?? null;
    this.spritesheet = spritesheet ?? null;
    this.loaded = false;
  }

  onSpriteLoaded(evt) {
    this.loaded = true;
    evt.handle();
  }

  onSpriteOffLoaded(evt) {
    this.loaded = false;

    evt.handle();
  }

  onUpdateFrame(evt) {
    const { frame } = evt.data;
    this.frame = frame;
    evt.handle();
  }
}
