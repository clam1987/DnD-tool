import { Component } from "geotic";
import { Hover } from "./Hover";

export class Interactive extends Component {
  constructor({ action }) {
    super();

    this.hovering = false;
    this.action = action || null;
    this.prev_hover = false;
  }

  onHover(evt) {
    this.hovering = true;
    if (!this.prev_hover) {
      this.entity.add(Hover);
    }
    this.entity.fireEvent("set-prev-hover", { hover: true });
    evt.handle();
  }

  onOffHover(evt) {
    this.hovering = false;
    if (this.entity.has(Hover)) {
      this.entity.remove(this.entity.hover);
    }
    this.entity.fireEvent("set-prev-hover", { hover: false });
    evt.handle();
  }

  onSetPrevHover(evt) {
    const { hover } = evt.data;
    this.hovering = hover;
    evt.handle();
  }
}
