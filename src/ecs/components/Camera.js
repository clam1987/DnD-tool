import { Component } from "geotic";

export class Camera extends Component {
  constructor({ type, fov, zoom, near, far }) {
    super();

    this.type = type ?? "perspective"; // perspective or orthographic
    this.fov = fov ?? 75;
    this.zoom = zoom ?? 1;
    this.near = near ?? 0.1;
    this.far = far ?? 1000;
    this.camera = null;
  }

  onSetCamera(evt) {
    const { camera } = evt.data;
    this.camera = camera;
    evt.handle();
  }
}
