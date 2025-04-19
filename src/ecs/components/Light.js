import { Component } from "geotic";

export class Light extends Component {
  constructor({ type, color, intensity, castShadow }) {
    super();

    this.type = type ?? "directional";
    this.color = color ?? "#ffffff";
    this.intensity = intensity ?? 1;
    this.cast_shadow = castShadow ?? false;
    this.light = null;
  }

  onSetLight(evt) {
    const { light } = evt.data;
    this.light = light;
    evt.handle();
  }
}
