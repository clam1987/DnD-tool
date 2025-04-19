import { Component } from "geotic";
import { Vector3 } from "three";

export class Velocity extends Component {
  constructor({ x, y, z, speed }) {
    super();
    this.vector = new Vector3(x || 0, y || 0, z || 0);
    this.speed = speed ?? 1;
  }
}
