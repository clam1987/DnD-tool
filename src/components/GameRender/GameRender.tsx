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
    const canvas = canvas_ref.current;
    if (!game_config || !canvas) return;

    const game_cart = new Game(game_config, canvas_ref);
    game_cart.start();

    return () => {
      if (game_cart) game_cart.destroy();
    };
  }, [game_config]);

  return (
    <canvas
      ref={canvas_ref}
      height={window.innerHeight}
      width={window.innerWidth}
    />
  );
};

export default GameRender;
