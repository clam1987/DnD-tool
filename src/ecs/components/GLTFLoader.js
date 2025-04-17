import { Component } from "geotic";

export class GltfLoader extends Component {
  constructor({ asset_name }) {
    super();

    this.asset_name = asset_name ?? "";
    this.loaded = false;
  }

  onGLTFLoaded(evt) {
    this.loaded = true;

    evt.handle();
  }

  onGLTFOffLoaded(evt) {
    this.loaded = false;

    evt.handle();
  }
}
