import System from "../core/System";
import { Light, Position } from "../components";
import { Color, AmbientLight, DirectionalLight, PointLight } from "three";

export class LightSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.scene_manager = null;
    this.lights = game.world.world.createQuery({
      all: [Light],
    })._cache;
  }

  update(dt) {
    if (!this.scene_manager) {
      this.scene_manager = this.game.managers.get("sceneManager");
    } else {
      for (const entity of this.lights) {
        const light_data = entity.light;
        if (!light_data.light) {
          const color = new Color(light_data.color);
          const intensity = light_data.intensity;
          let light;

          switch (light_data.type) {
            case "ambient":
              light = new AmbientLight(color, intensity);
              break;
            case "directional":
              light = new DirectionalLight(color, intensity);
              light.castShadow = light_data.cast_shadow;
              break;
            case "point":
              light = new PointLight(color, intensity);
              break;
            default:
              console.warn(`Unknown light type: ${light_data.type}`);
              continue;
          }

          entity.fireEvent("set-light", { light });
          const scene = this.scene_manager.getScene();
          scene.add(light);

          if (entity?.position) {
            const { x, y, z } = entity.position.coords;
            light.position.set(x, y, z);
          }
        }
      }
    }
  }
}
