import { Component } from "geotic";

export class ActionHandler extends Component {
  constructor({ actions }) {
    super();

    this.actions = actions || null;
  }

  onUpdateActions(evt) {
    const { actions } = evt.data;
    this.actions = actions;

    evt.handle();
  }
}
