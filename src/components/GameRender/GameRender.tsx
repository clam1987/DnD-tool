"use client";
import { useState, useEffect, useRef } from "react";
// import DnD_Config from "";
import Game from "../../ecs/core/Game";

const GameRender = () => {
  const [game_config, setGameConfig] = useState<any>();
  const [loading_config, setLoadingConfig] = useState<boolean>(false);
  const canvas_ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!loading_config && !game_config) {
      setLoadingConfig(true);
      loadGameConfig(null);
    }
  }, [loading_config, game_config]);

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!game_config || !canvas) return;

    canvas.focus();

    const game_cart = new Game(game_config, canvas_ref);
    game_cart.start();

    return () => {
      if (game_cart) game_cart.destroy();
    };
  }, [game_config]);

  const loadGameConfig = async (game: string | null) => {
    try {
      const response = await fetch("/games/dnd/DnD.json");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setGameConfig(data);
    } catch (err) {
      console.error("Failed to load game config:", err);
    }
  };

  if (!game_config) return <div>Loading...</div>;

  return (
    <canvas
      ref={canvas_ref}
      height={window.innerHeight}
      width={window.innerWidth}
      tabIndex={0}
    />
  );
};

export default GameRender;
