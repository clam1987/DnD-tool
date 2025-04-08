"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export default function Three() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let scene: any, camera: any, renderer: any, textMesh: any;

  useEffect(() => {
    // Initialize Three.js scene
    if (!canvasRef.current) return;
    scene = new THREE.Scene();

    // Initialize camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5; // Moved camera back

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xaaaaaa); // Set a light gray background

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Load font and create text
    const fontLoader = new FontLoader();
    fontLoader.load(
      "./assets/fonts/Harmony_Regular.json",
      (font) => {
        const textGeometry = new TextGeometry("Wilson Loves Coke!", {
          font: font,
          size: 2,
          depth: 0.1, // Renamed from 'height'
          curveSegments: 12,
          bevelEnabled: false,
        });
        textGeometry.center();
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Changed text color to red
        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);

        // Start the animation loop
        animate();
      },
      () => {},
      (error) => {
        console.error("Error loading font:", error); // Log font loading errors
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // Handle window resizing
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);
  }, []);

  // return <canvas ref={canvasRef} />;
  return <div>Ok</div>;
}
