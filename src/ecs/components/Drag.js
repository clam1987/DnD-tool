import { Component } from "geotic";
import { Vector3 } from "three";

export class Drag extends Component {
  constructor() {
    super();

    this.active = false;
    this.offset = new Vector3();
  }

  onAttached() {
    if (this.entity?.position) {
      const { x, y, z } = this.entity.position;
      this.start = new Vector3(x, y, z);
    }
  }

  onDragStart(evt) {
    console.log("Drag Start!");
    const { offset } = evt.data;
    this.active = true;
    this.offset.copy(offset);

    evt.handle();
  }

  onDragEnd(evt) {
    this.active = false;

    evt.handle();
  }
}
