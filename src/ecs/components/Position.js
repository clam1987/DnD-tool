import { Component } from "geotic";

export class Position extends Component {
  constructor({ x, y, previous_position }) {
    super();
    this.x = x;
    this.y = y;
    this.previous_position = null || previous_position;
  }

  onSetPosition(evt) {
    const { x, y } = evt.data;
    this.x = x;
    this.y = y;
  }
}
