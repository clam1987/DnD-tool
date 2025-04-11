export default function changeColor(entity, payload) {
  const group = entity.renderable.group;
  let { backgroundColor, color } = payload;

  if (group) {
    const button_mesh = group.children.find(
      (mesh) =>
        mesh.geometry.type === "BoxGeometry" &&
        mesh.material.type === "MeshBasicMaterial"
    );
    const text_mesh = group.children.find(
      (mesh) =>
        mesh.geometry.type === "TextGeometry" &&
        mesh.material.type === "MeshBasicMaterial"
    );
    const current_background_color = button_mesh.material.color.getHexString();
    const current_text_color = text_mesh.material.color.getHexString();
    backgroundColor = backgroundColor || current_background_color;
    color = color || current_text_color;
    button_mesh.material.color.set(
      current_background_color === "2fc5f6" ? backgroundColor : "#2fc5f6"
    );
    text_mesh.material.color.set(
      current_text_color === "ffffff" ? `#${color}` : "#ffffff"
    );
  }
}
