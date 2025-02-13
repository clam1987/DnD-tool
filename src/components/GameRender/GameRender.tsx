"use client";
import { useState, useEffect, useRef } from "react";
import DnD_Config from "../../games/DnD/Dnd.json";
import Game from "../../ecs/core/Game";

const GameRender = () => {
  const [game_config, setGameConfig] = useState<any>();
  const canvas_ref = useRef(null);

  useEffect(() => {
    setGameConfig(DnD_Config);
  }, []);

  useEffect(() => {
    if (!game_config) return;

    const game_cart = new Game(game_config, canvas_ref);

    return () => {
      if (game_cart) game_cart.destroy();
    };
  }, [game_config]);

  return (
    <div
      id="game-container"
      style={{ display: "block" }}
      ref={canvas_ref}
    ></div>
  );
};

export default GameRender;
