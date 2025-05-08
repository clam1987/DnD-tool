import { Component } from "geotic";
import { Vector3 } from "three";

export class CameraFollow extends Component {
  constructor({ target, offset, damping }) {
    super();

    this.target = target ?? null;
    this.offset = new Vector3(offset.x ?? 0, offset.y ?? 5, offset.z ?? 10);
    this.damping = damping ?? 5;
  }

  onUpdateTarget(evt) {
    const { target } = evt.data;
    this.target = target;
  }
}
