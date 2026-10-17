"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Bitz3DStage({
  pupilOffset = { x: 0, y: 0 },
  headTilt = 0,
  moodReaction = "happy",
  onPokeBelly,
  onAntennaClick,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({ pupilOffset, headTilt, moodReaction });

  useEffect(() => {
    stateRef.current = { pupilOffset, headTilt, moodReaction };
  }, [pupilOffset, headTilt, moodReaction]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === "undefined") return;

    let frameId;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      // Headless test fallback
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 300;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 6.2);

    // Studio 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xe0e7ff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.2, 12);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const warmLanternLight = new THREE.PointLight(0xfbbf24, 2.5, 8);
    warmLanternLight.position.set(-1.5, -0.4, 2.2);
    scene.add(warmLanternLight);

    // Character Root Group
    const bitzGroup = new THREE.Group();
    scene.add(bitzGroup);

    // Fluffy Cloud Plushie Material
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.55,
      metalness: 0.05,
    });

    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      roughness: 0.65,
      metalness: 0.1,
    });

    // Main Chubby Head/Body Sphere + Cloud Puffs
    const mainBody = new THREE.Mesh(new THREE.SphereGeometry(1.22, 32, 32), cloudMat);
    mainBody.scale.set(1.18, 0.96, 1.05);
    bitzGroup.add(mainBody);

    const leftPuff = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 24), cloudMat);
    leftPuff.position.set(-0.85, -0.1, 0.15);
    bitzGroup.add(leftPuff);

    const rightPuff = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 24), cloudMat);
    rightPuff.position.set(0.85, -0.1, 0.15);
    bitzGroup.add(rightPuff);

    // Periwinkle Knit Nightcap Cone + Brim
    const capBrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.18, 16, 40),
      cushionMat
    );
    capBrim.position.set(0, 0.72, 0.05);
    capBrim.rotation.x = Math.PI / 2 - 0.18;
    bitzGroup.add(capBrim);

    const capTop = new THREE.Mesh(
      new THREE.ConeGeometry(0.92, 1.25, 28),
      cushionMat
    );
    capTop.position.set(0.12, 1.32, -0.05);
    capTop.rotation.z = -0.25;
    bitzGroup.add(capTop);

    // Golden Star-Bell Antenna Tip
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.45,
    });
    const antennaOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 1), goldMat);
    antennaOrb.position.set(0.45, 1.92, 0);
    bitzGroup.add(antennaOrb);

    // Glossy Kawaii Eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.1,
      metalness: 0.2,
    });
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.44, 0.1, 1.15);
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 24), eyeMat);
    const leftSpark = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), goldMat);
    leftSpark.position.set(-0.06, 0.06, 0.18);
    leftEyeGroup.add(leftEye, leftSpark);
    bitzGroup.add(leftEyeGroup);

    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.44, 0.1, 1.15);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 24), eyeMat);
    const rightSpark = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), goldMat);
    rightSpark.position.set(-0.06, 0.06, 0.18);
    rightEyeGroup.add(rightEye, rightSpark);
    bitzGroup.add(rightEyeGroup);

    // Rosy Kawaii Cheeks
    const cheekMat = new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      roughness: 0.5,
      transparent: true,
      opacity: 0.75,
    });
    const leftCheek = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), cheekMat);
    leftCheek.scale.set(1.3, 0.75, 0.5);
    leftCheek.position.set(-0.75, -0.14, 1.12);
    const rightCheek = leftCheek.clone();
    rightCheek.position.set(0.75, -0.14, 1.12);
    bitzGroup.add(leftCheek, rightCheek);

    // Twilight Cushion Cloud Base
    const baseCloud = new THREE.Group();
    baseCloud.position.set(0, -1.15, 0);
    [-0.9, -0.3, 0.3, 0.9].forEach((xPos, idx) => {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(idx % 2 === 0 ? 0.52 : 0.62, 24, 24),
        cushionMat
      );
      puff.position.set(xPos, 0, 0.2);
      baseCloud.add(puff);
    });
    bitzGroup.add(baseCloud);

    // Drag-to-rotate interaction
    let isDragging = false;
    let prevX = 0;
    let userRotationY = 0;

    const onDown = (e) => {
      isDragging = true;
      prevX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      userRotationY += (clientX - prevX) * 0.012;
      prevX = clientX;
    };
    const onUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    let clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const { pupilOffset: pOff, headTilt: tilt, moodReaction: mood } = stateRef.current;

      // Gentle floating & breathing
      bitzGroup.position.y = Math.sin(elapsed * 2.2) * 0.12;
      bitzGroup.rotation.y =
        userRotationY + (pOff.x * 0.04) + Math.sin(elapsed * 0.8) * 0.08;
      bitzGroup.rotation.z = -(tilt * 0.02);

      // Eyes track cursor
      leftEyeGroup.position.x = -0.44 + pOff.x * 0.015;
      leftEyeGroup.position.y = 0.1 - pOff.y * 0.015;
      rightEyeGroup.position.x = 0.44 + pOff.x * 0.015;
      rightEyeGroup.position.y = 0.1 - pOff.y * 0.015;

      // Spin star-bell faster during Rainbow Easter Egg or Giggle
      antennaOrb.rotation.y += mood === "rainbow" ? 0.18 : 0.03;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      container.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (frameId) window.cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[340px] flex flex-col items-center justify-center">
      <div
        ref={mountRef}
        onClick={onPokeBelly}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Drag horizontally to rotate Bitz in 3D, or click to tickle!"
      />
      <span className="absolute bottom-2 px-3 py-1 rounded-full text-[11px] font-mono bg-indigo-950/70 text-sky-200 border border-sky-400/30 pointer-events-none">
        🧊 Interactive 3D WebGL Mode · Drag to Rotate 360°
      </span>
    </div>
  );
}
