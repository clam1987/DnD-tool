import { Component } from "geotic";
import { Vector3 } from "three";

export class Position extends Component {
  constructor({ x, y, z, previous_position }) {
    super();
    this.coords = new Vector3(x, y, z);
    this.previous_position = new Vector3();
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

  onSetPosition(evt) {
    const { x, y, z } = evt.data;
    this.previous_position.copy(this.coords);
    this.coords.set(x, y, z);
  }

  onMovePosition(evt) {
    // console.log("Move Position!");
    const { mouse } = evt.data;
    // console.log(mouse);
    this.previous_position.copy(this.coords);
    this.coords.copy(mouse);
    // this.coords.set(mouse.x, mouse.y, mouse.z);
  }
}
