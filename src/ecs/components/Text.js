import { Component } from "geotic";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export class Text extends Component {
  constructor({ text, style }) {
    super();

    this.text = null || text;
    this.style = null || style;
    this.mesh = null;
  }

  onCreateText(evt) {
    if (this.text === null) {
      this.text = "Hello World!";
    }

    if (this.style === null) {
      this.style = {
        font: "/assets/fonts/Harmony_Regular.json",
        size: 10,
        color: "#ffffff",
        depth: 0.1,
      };
    }

    const fontLoader = new FontLoader();
    fontLoader.load(this.style.fontFamily, (font) => {
      const geometry = new TextGeometry(this.text, {
        font,
        size: this.style.fontSize,
        depth: this.style.depth,
        curveSegments: 12,
        bevelEnabled: false,
      });
      geometry.center();
      const material = new THREE.MeshBasicMaterial({
        color: this.style.color,
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(
        this.entity.position.x,
        this.entity.position.y,
        this.entity.position.z
      );
    });
    evt.handle();
  }

  onChangeText(evt) {
    const { text } = evt.data;
    this.text = text;
    evt.handle();
  }
}
