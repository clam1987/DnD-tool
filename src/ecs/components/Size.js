import { Component } from "geotic";

export class Size extends Component {
  constructor({ width, height }) {
    super();
    this.width = width || 0;
    this.height = height || 0;
  }

  onChangeSize(evt) {
    const { width, height } = evt.data;
    this.width = width;
    this.height = height;
    evt.handle();
  }
}
