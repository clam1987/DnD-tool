import System from "../core/System";
import { Velocity, Position } from "../components";

export class MovementSystem extends System {
  constructor(game) {
    super(game);

    this.game = game;
    this.input_manager = null;
    this.velocities = game.world.world.createQuery({
      all: [Velocity, Position],
    })._cache;
  }

  update(dt) {
    if (!this.input_manager) {
      this.input_manager = this.game.managers.get("inputManager");
    } else {
      for (const entity of this.velocities) {
        const { vector, speed } = entity.velocity;
        const { coords } = entity.position;
        coords.addScaledVector(vector, speed * dt);
        entity.fireEvent("update-position", {
          coords,
        });

        if (entity.renderable?.group) {
          entity.renderable.group.position.copy(coords);
          entity.remove(entity.velocity);
        }
      }
    }
  }
}
