"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import Galaxy from "@/assets/stars_milky_way.jpg";

export const GalaxyBackground = () => {
  const texture = useTexture(Galaxy);

  // Configuramos la textura para que los colores sean realistas (sRGB)
  // eslint-disable-next-line react-hooks/immutability
  texture.colorSpace = THREE.SRGBColorSpace;
  // texture.minFilter = THREE.LinearFilter; // Opcional, para evitar pixelado si la imagen es pequeña

  return (
    <mesh matrixAutoUpdate={false}>
      {/* Radio 10,000 es perfecto si el far de la cámara es > 10,000 */}
      <sphereGeometry args={[10000, 64, 64]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
        toneMapped={false} // Evita que la exposición de la escena afecte al fondo
      />
    </mesh>
  );
};