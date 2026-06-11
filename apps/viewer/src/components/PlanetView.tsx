import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { OrbitPath } from "./OrbitPath";
import { Planet } from "@/packages/core/bodies/planet";

const BLANK_TEX = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

interface PlanetViewProps {
  planet: Planet; 
}

export const PlanetView = ({ planet }: PlanetViewProps) => {
  const { body, data } = planet;
  const groupRef = useRef<THREE.Group>(null!);
  const surfaceRef = useRef<THREE.Mesh>(null!);
  
  // Usamos el hook de React para las texturas (más eficiente que TextureLoader manual)
  const texture = useTexture(data.textureUrl || BLANK_TEX);

  // Escala visual separada de la física
  const visualScale = body.type === "star" ? 35 : 1200; 
  const displayRadius = data.radius * visualScale;

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Sincronización con la física de la clase
      groupRef.current.position.set(...body.position);
      
      // Rotación intrínseca usando el speed de la clase
      if (surfaceRef.current && body.type !== "star") {
        const radiansPerYear = 2 * Math.PI * (data.rotationSpeed || 1);
        surfaceRef.current.rotation.y += delta * radiansPerYear;
      }
    }
  });

  return (
    <>
      {/* Línea de órbita usando datos de la clase */}
      {body.type === "planet" && data.semiMajorAxis && (
        <OrbitPath 
          semiMajorAxis={data.semiMajorAxis} 
          eccentricity={data.eccentricity ?? 0} 
          color={data.color} 
        />
      )}

      <group ref={groupRef}>
        {/* Inclinación axial */}
        <group rotation-z={THREE.MathUtils.degToRad(data.axialTilt ?? 0)}>
          <mesh ref={surfaceRef}>
            <sphereGeometry args={[displayRadius, 64, 64]} />
            
            {body.type === "star" ? (
              <meshBasicMaterial 
                map={data.textureUrl ? texture : null} 
                color={data.color} 
              />
            ) : (
              <meshStandardMaterial 
                map={data.textureUrl ? texture : null} 
                color={data.textureUrl ? 0xffffff : data.color} 
                roughness={0.8}
              />
            )}
          </mesh>
        </group>
      </group>
    </>
  );
};