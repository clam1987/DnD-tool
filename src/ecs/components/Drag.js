import { Component } from "geotic";

export class Drag extends Component {
  constructor() {
    super();

    this.start = { x: 0, y: 0, z: 0 };
    this.current = { x: 0, y: 0, z: 0 };
    this.active = false;
  }

  onAttached() {
    this.start.x = this.entity.position.x;
    this.start.y = this.entity.position.y;
    this.start.z = this.entity.position.z;
  }

  onDragStart(evt) {
    this.active = true;

    evt.handle();
  }

  onDragging(evt) {
    const { mouse, dt } = evt.data;
    evt.handle();
  }

  onDragEnd(evt) {
    this.active = false;

    evt.handle();
  }
}
