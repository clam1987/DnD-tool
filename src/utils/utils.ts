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

/**
 * Normalize a loaded glTF scene *in place* by parenting it to a pivot group.
 * @param {Group} model_scene - The glTF model.scene loaded by GLTFLoader.
 * @param {number} desiredSize - The desired maximum dimension (world units).
 * @returns {[Group, Group]} [pivot, model_scene]
 */
export function normalizeGLTF(model_scene: Group, desiredSize = 1) {
  // 1. Create a pivot group
  const pivot = new Group();

  // 2. Add the model scene under the pivot
  pivot.add(model_scene);

  // 3. Measure the model_scene's bounding box
  const box = new Box3().setFromObject(model_scene);
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // 4. Compute uniform scale factor
  const scale = desiredSize / maxDim;
  pivot.scale.setScalar(scale);

  // 5. Recompute bounding box after scaling
  const boxScaled = new Box3().setFromObject(model_scene);
  const center = boxScaled.getCenter(new Vector3());

  // 6. Center the model_scene within the pivot
  model_scene.position.sub(center);

  // 7. Optional: Rotate the pivot so the model faces the camera
  // pivot.rotation.y = MathUtils.degToRad(30);
  // pivot.rotation.x = MathUtils.degToRad(10);

  return [pivot, model_scene];
}
