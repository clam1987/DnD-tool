import { Component } from "geotic";

export class SpriteLoader extends Component {
  constructor({ path, asset_name }) {
    super();

    this.path = path ?? "";
    this.asset_name = asset_name ?? "";
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
}
