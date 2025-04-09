import { Component } from "geotic";

export class Text extends Component {
  constructor({ text, style }) {
    super();

    this.text = null || text;
  }

  onChangeText(evt) {
    const { text } = evt.data;
    this.text = text;
    evt.handle();
  }
}
