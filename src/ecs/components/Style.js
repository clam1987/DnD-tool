import { Component } from "geotic";

export class Style extends Component {
  constructor({ css, hover_style }) {
    super();

    this.css = css || {};
    this.hover_style = hover_style || {};
  }
}
