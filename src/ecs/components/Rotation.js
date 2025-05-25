import { Component } from "geotic";
import { Euler } from "three";

export class Rotation extends Component {
  constructor({ x, y, z }) {
    super();

    this.euler = new Euler(x ?? -45, y ?? 45, z ?? 0, "XYZ");
  }

  onUpdateRotation(evt) {
    const { y } = evt.data;
    const current_y = this.euler.y;
    const alpha = 0.1;
    const delta_y = y - current_y;
    this.euler.y += delta_y * alpha;

    this.entity.renderable?.group.rotation.copy(this.euler);
  }
}
