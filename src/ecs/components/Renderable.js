import { Component } from "geotic";
import {
  Group,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
} from "three";
import { normalizeGLTF } from "../../utils/utils";
import { Text } from "troika-three-text";

export class Renderable extends Component {
  constructor({ type, layer }) {
    super();
    this.type = type || null;
    this.layer = layer || null;
    this.group = null;
    this.updated = false;
  }

  onCreateObject(evt) {
    const group = new Group();
    switch (this.type) {
      case "mesh":
        this.#displayMesh(this.entity.size, this.entity.style.css, group);
        break;
      case "sprite":
        const { texture, frames } = evt.data;
        const { frame, name } = this.entity.spriteLoader;
        const frame_data = frames[frame];
        if (frame_data === undefined) {
          console.warn(`Frame "${frame}" not found for frame: ${name}`);
          return;
        }

        this.#displaySprite(name, group, frame_data, texture);
        break;
      case "line":
        break;
      case "text":
        this.#displayText(this.entity.text.text, this.entity.style.css, group);
        break;
      case "gltf":
        const { model } = evt.data;
        this.#displayGLTF(model, group);
        break;
      default:
        console.warn(`Unknown renderable type: ${this.type}`);
    }

    this.group = group;
    evt.handle();
  }

  onUpdateObject(evt) {}

  #displayMesh(size, style, parent_group) {
    const { width, height } = size;
    const geometry = new BoxGeometry(width, height, 0.1);
    const material = new MeshBasicMaterial({
      color: style.backgroundColor,
    });
    const box_mesh = new Mesh(geometry, material);
    box_mesh.position.copy(this.entity.position.coords);
    parent_group.add(box_mesh);

    if (this.entity.text) {
      this.#displayText(
        this.entity.text.text,
        this.entity.style.css,
        parent_group
      );
    }
  }

  #displaySprite(sprite_sheet_name, parent_group, frame_data, texture) {
    if (sprite_sheet_name === null || frame_data === null) return;

    const { frame, spriteSourceSize } = frame_data;
    const geometry = new PlaneGeometry(
      spriteSourceSize.w / 100,
      spriteSourceSize.h / 100
    );
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const mesh = new Mesh(geometry, material);

    const texture_w = texture.image.width;
    const texture_h = texture.image.height;

    const offset_x = frame.x / texture_w;
    const offset_y = frame.y / texture_h;
    const repeat_x = frame.w / texture_w;
    const repeat_y = frame.h / texture_h;

    texture.repeat.set(repeat_x, repeat_y);
    texture.offset.set(offset_x, 1 - offset_y - repeat_y);
    texture.needsUpdate = true;

    parent_group.add(mesh);
  }

  #displayGLTF(model, parent_group) {
    if (model === null) return;

    const normalized_model = normalizeGLTF(model, 2);
    parent_group.add(normalized_model);
  }

  #displayText(text, style, parent_group) {
    if (text === null) {
      text = "Hello World!";
    }

    if (style === null) {
      style = {
        fontFamily: "/assets/fonts/Harmony.otf",
        fontSize: 10,
        color: "#ffffff",
        depth: 0.1,
      };
    }

    const text_mesh = new Text();

    text_mesh.text = text;
    text_mesh.fontSize = style.fontSize;
    text_mesh.color = style.color;
    text_mesh.font = style.fontFamily;
    text_mesh.anchorX = "center";
    text_mesh.anchorY = "middle";
    text_mesh.sync();

    // Positioning: center in group with slight Z offset
    if (text_mesh.position === null) {
      text_mesh.position.set(0, 0, 0);
    }

    text_mesh.position.copy({
      ...this.entity.position.coords,
      z: this.entity.position.coords.z + 0.06,
    });

    const { x, y, z } = this.entity.position.coords;
    text_mesh.position.set(x, y, z + 0.06);

    parent_group.add(text_mesh);
  }

  onUpdateSprite(evt) {
    const { frame_data, dt } = evt.data;
    if (!frame_data || !this.group) return;
    const { frame } = frame_data;
    const texture = this.group.children[0].material.map;
    const texture_w = texture.image.width;
    const texture_h = texture.image.height;

    texture.repeat.set(frame.w / texture_w, frame.h / texture_h);
    texture.offset.set(
      frame.x / texture_w,
      1 - (frame.y + frame.h) / texture_h
    );
    evt.handle();
  }
}
