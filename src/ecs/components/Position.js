import { Component } from "geotic";
import { Vector3 } from "three";

export class Position extends Component {
  constructor({ x, y, z }) {
    super();

    this.coords = new Vector3(x, y, z);
    this.previous_position = new Vector3(x, y, z);
  }

  get x() {
    return this.coords.x;
  }

  get y() {
    return this.coords.y;
  }

  get z() {
    return this.coords.z;
  }

  onUpdatePosition(evt) {
    const { coords } = evt.data;
    this.previous_position.set(coords.x, coords.y, coords.z);
    this.coords.set(coords.x, coords.y, coords.z);
  }

  onMovePosition(evt) {
    const { mouse } = evt.data;
    this.previous_position.copy(this.coords);
    this.coords.copy(mouse);
  }
}
