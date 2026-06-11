"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { useState, Suspense, useMemo } from "react";

// Motor y Tipos
import { step } from "@/packages/physics/integrator";
import { Planet } from "@/packages/core/bodies/planet";
import { EARTH_DATA, SUN_DATA } from "@/lib/constants/astronomy";

// Componentes Visuales
import { PlanetView } from "../components/PlanetView";
import { Controls } from "../components/hud/Controls";
import { GalaxyBackground } from "./visuals/GalaxyBackground";
import { Sun } from "./visuals/Sun";

export const Universe = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(0.1);

  const [planets] = useState(() => {
    const sunBody = {
      id: "sun-001", name: SUN_DATA.name, type: "star" as const,
      mass: SUN_DATA.mass, position: [0, 0, 0] as [number, number, number],
      velocity: [0, 0, 0] as [number, number, number],
    };

    const earthBody = {
      id: "earth-001", name: EARTH_DATA.name, type: "planet" as const,
      mass: EARTH_DATA.mass, position: [EARTH_DATA.semiMajorAxis ?? 1.0, 0, 0] as [number, number, number],
      velocity: [0, 0, EARTH_DATA.orbitalVelocity ?? 6.28] as [number, number, number],
    };

    return [new Planet(sunBody, SUN_DATA), new Planet(earthBody, EARTH_DATA)];
  });

  return (
    <div style={{ width: "100vw", height: "100vh", position: 'relative', background: '#000' }}>
      <Controls 
        isPaused={isPaused} onTogglePause={() => setIsPaused(!isPaused)} 
        timeScale={timeScale} onTimeScaleChange={setTimeScale}
      />

      <Canvas gl={{ logarithmicDepthBuffer: true }} 
      camera={{ far: 20000 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} far={25000} />
          <OrbitControls makeDefault enableDamping minDistance={0.1} maxDistance={2000} />

          {/* Iluminación base muy tenue */}
          <ambientLight intensity={0.10} />
                    <Stars radius={200} depth={50} count={6000} factor={4} fade />

          {/* Fondo Galáctico Realista */}
          <GalaxyBackground />

          {/* Estrellas de paralaje (capa media) */}

          {/* Nuestro Sol Mejorado */}
          <Sun radius={SUN_DATA.radius * 35} />

          {/* Loop de Física y Renderizado de Planetas */}
          <PhysicsLoop 
            planets={planets} 
            isPaused={isPaused} 
            timeScale={timeScale}
            onUpdateElapsed={() => {}}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

const PhysicsLoop = ({ planets, isPaused, timeScale, onUpdateElapsed }: { planets: Planet[]; isPaused: boolean; timeScale: number; onUpdateElapsed: (updater: (prev: number) => number) => void; }) => {
  const bodies = useMemo(() => planets.map((p: Planet) => p.body), [planets]);

  useFrame((_, delta) => {
    if (!isPaused) {
      const dt = delta * timeScale;
      step(bodies, dt);
      onUpdateElapsed((prev: number) => prev + dt);
    }
  });

  return (
    <>
      {planets.map((p: Planet) => (
        // No renderizamos el Sol aquí si ya lo pusimos manualmente arriba
        p.body.type !== "star" && <PlanetView key={p.body.id} planet={p} />
      ))}
    </>
  );
};