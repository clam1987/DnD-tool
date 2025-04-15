import { Component } from "geotic";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import Text from "troika-three-text";

export class Renderable extends Component {
  constructor({ type, layer }) {
    super();
    this.type = type || null;
    this.layer = layer || null;
    this.group = null;
    this.updated = false;
  }

  onCreateObject(evt) {
    const group = new THREE.Group();
    switch (this.type) {
      case "mesh":
        this.displayMesh(this.entity.size, this.entity.style.css, group);
        break;
      case "sprite":
        break;
      case "line":
        break;
      case "text":
        this.displayText(this.entity.text.text, this.entity.style.css, group);
        break;
      case "gltf":
        break;
      default:
        console.warn(`Unknown renderable type: ${this.type}`);
    }

    this.group = group;
    evt.handle();
  }

  onUpdateObject(evt) {}

  displayMesh(size, style, parent_group) {
    const { width, height } = size;
    const geometry = new THREE.BoxGeometry(width, height, 0.1);
    const material = new THREE.MeshBasicMaterial({
      color: style.backgroundColor,
    });
    const box_mesh = new THREE.Mesh(geometry, material);
    box_mesh.position.copy(this.entity.position.coords);
    parent_group.add(box_mesh);

    if (this.entity.text) {
      this.displayText(
        this.entity.text.text,
        this.entity.style.css,
        parent_group
      );
    }
  }

  displaySprite(path, style, parent_group) {}

  displayGLTF(path, style, parent_group) {}

  displayText(text, style, parent_group) {
    if (text === null) {
      text = "Hello World!";
    }

    if (style === null) {
      style = {
        fontFamily: "/assets/fonts/Harmony_Regular.json",
        fontSize: 10,
        color: "#ffffff",
        depth: 0.1,
      };
    }

    const fontLoader = new FontLoader();
    fontLoader.load(style.fontFamily, (font) => {
      const geometry = new TextGeometry(text, {
        font,
        size: style.fontSize,
        depth: style.depth,
        curveSegments: 12,
        bevelEnabled: false,
      });
      geometry.center();

      const material = new THREE.MeshBasicMaterial({
        color: style.color,
      });
      const text_mesh = new THREE.Mesh(geometry, material);

      if (text_mesh.position === null) {
        text_mesh.position.set(0, 0, 0);
      }

      text_mesh.position.copy({
        ...this.entity.position.coords,
        z: this.entity.position.coords.z + 0.06,
      });

      parent_group.add(text_mesh);
    });
  }
}
