import { Component } from "geotic";

export class Position extends Component {
  constructor({ x, y, z, previous_position }) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
    this.previous_position = null || previous_position;
  }

  onSetPosition(evt) {
    const { x, y, z } = evt.data;
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
