import { Component } from "geotic";

export class GLTFLoader extends Component {
  constructor({ path, asset_name }) {
    super();

    this.path = path ?? "";
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
