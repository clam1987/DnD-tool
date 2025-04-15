import { Component } from "geotic";
import { Vector3 } from "three";

export class Drag extends Component {
  constructor({
    offset,
    target_position,
    last_mouse,
    start_time,
    plane_z,
    active,
  }) {
    super();

    this.offset = offset ?? new Vector3();
    this.target_position = target_position ?? null;
    this.last_mouse = last_mouse ?? null;
    this.plane_z = plane_z ?? null;
    this.start_time = start_time ?? performance.now();
    this.active = active ?? false;
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
