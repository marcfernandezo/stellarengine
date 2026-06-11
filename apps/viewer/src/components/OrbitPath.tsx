import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useMemo } from "react";

interface OrbitPathProps {
  semiMajorAxis: number;
  eccentricity: number;
  color: number | string;
}

export const OrbitPath = ({ semiMajorAxis, eccentricity, color }: OrbitPathProps) => {
  const points = useMemo(() => {
    // Calculamos el eje menor para órbitas elípticas reales
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(eccentricity, 2));
    
    // Creamos la curva elíptica
    const curve = new THREE.EllipseCurve(
      0, 0,             
      semiMajorAxis, semiMinorAxis, 
      0, 2 * Math.PI,  
      false, 0         
    );

    // Convertimos los puntos de la curva (2D) a vectores (3D) en el plano XZ
    return curve.getPoints(128).map(p => new THREE.Vector3(p.x, 0, p.y));
  }, [semiMajorAxis, eccentricity]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.6}
      transparent
      opacity={0.3}
    />
  );
};