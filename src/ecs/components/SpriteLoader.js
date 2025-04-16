import { Component } from "geotic";

export class SpriteLoader extends Component {
  constructor({ asset_path, asset_name, json_path }) {
    super();

    this.asset_path = asset_path ?? "";
    this.json_path = json_path ?? "";
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
