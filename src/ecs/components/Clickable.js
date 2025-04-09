import { Component } from "geotic";

export class Clickable extends Component {
  onClick(evt) {
    const { x, y, z } = evt.data;
    console.log(`Clicked at position: x: ${x}, y: ${y}!, z: ${z}`);
    evt.handle();
  }
}
