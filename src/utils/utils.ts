import { Box3, Vector3, Group, MathUtils } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export const createMap = (
  length: number,
  width: number,
  fillVal: string | number
) => {
  return Array.from({ length }, () =>
    Array.from({ length: width }, () => fillVal)
  );
};

export const camelCase = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index: number) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, "");

export const normalizeGLTF = (model: GLTF, desiredSize: number = 2): Group => {
  const cloned_model: Group = model.scene.clone() as Group;
  const box: Box3 = new Box3().setFromObject(cloned_model);
  const size: Vector3 = new Vector3();
  box.getSize(size);

  const max_dim: number = Math.max(size.x, size.y, size.z);
  const scale_factor: number = desiredSize / max_dim;

  cloned_model.scale.setScalar(scale_factor);

  const center: Vector3 = new Vector3();
  box.getCenter(center);
  cloned_model.position.sub(center);

  // Rotate the model to face the camera will delete this later
  const rotation_degreesX = 10;
  const rotationRadiansX = MathUtils.degToRad(rotation_degreesX);
  const rotation_degreesY = 30;
  const rotationRadiansY = MathUtils.degToRad(rotation_degreesY);

  cloned_model.rotateY(rotationRadiansY);
  cloned_model.rotateX(rotationRadiansX);

  return cloned_model;
};
