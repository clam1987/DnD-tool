import { Component } from "geotic";

export class Player extends Component {
  constructor({ speed }) {
    super();

    this.speed = speed ?? 1; // Default speed is 1 unit per second
  }
}
