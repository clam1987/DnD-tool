import { Component } from "geotic";

export class Hover extends Component {
  constructor() {
    super();
    this.hovering = false;
  }

  onEnter() {
    this.hovering = true;
  }

  onLeave() {
    this.hovering = false;
  }
}
