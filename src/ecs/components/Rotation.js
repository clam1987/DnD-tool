import { Component } from "geotic";
import { Euler } from "three";

export class Rotation extends Component {
  constructor({ x, y, z }) {
    super();

    this.euler = new Euler(x ?? -45, y ?? 45, z ?? 0, "XYZ");
  }

  onUpdateRotation(evt) {
    const { y } = evt.data;
    this.euler.y = y;
    this.entity.renderable?.group.rotation.copy(this.euler);
  }
}
