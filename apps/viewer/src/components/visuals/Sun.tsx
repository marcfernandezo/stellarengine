/* eslint-disable react-hooks/immutability */
"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import SunTexture from "@/assets/2k_sun.jpg"

// Glsl Simplex Noise 3D para realismo procedural
const noiseFunction = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
`;

interface SunProps {
  radius?: number;
  intensity?: number;
  speed?: number;
}

export const Sun = ({ radius = 1, intensity = 15, speed = 1 }: SunProps) => {
  const mainMesh = useRef<THREE.Mesh>(null!);
  const coronaMesh = useRef<THREE.Mesh>(null!);
  const glowMesh = useRef<THREE.Mesh>(null!);

  // Carga de textura solar (reemplazar por tu path asset)
  const sunTexture = useTexture(SunTexture);

  // 1. SHADER DE FOTOSFERA (Superficie Granulada)
  const photosphereMaterial = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: sunTexture },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      ${noiseFunction}
      uniform float uTime;
      uniform sampler2D uTexture;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        // Rotación diferencial simulada
        float diffRotation = uTime * 0.1 * (1.0 - abs(vUv.y - 0.5));
        vec2 rotatedUv = vec2(vUv.x + diffRotation, vUv.y);
        
        // Capas de ruido para plasma y granulación
        float noise1 = snoise(vPosition * 2.0 + uTime * 0.2);
        float noise2 = snoise(vPosition * 10.0 - uTime * 0.5);
        float combinedNoise = (noise1 * 0.7 + noise2 * 0.3);

        // Manchas solares (zonas de baja temperatura)
        float sunspots = smoothstep(0.4, 0.2, snoise(vPosition * 1.5 + uTime * 0.05));
        
        // Color base de la textura
        vec4 tex = texture2D(uTexture, rotatedUv);
        
        // Fresnel para oscurecimiento de limbo
        float fresnel = pow(dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.5);
        
        // Mezcla final de colores (Amarillo nuclear a Naranja de borde)
        vec3 colorA = vec3(1.0, 0.9, 0.5); // Núcleo
        vec3 colorB = vec3(0.8, 0.2, 0.0); // Filamentos naranja
        
        vec3 finalColor = mix(colorB, colorA, fresnel + combinedNoise * 0.2);
        finalColor *= (1.0 - sunspots * 0.6); // Aplicar manchas solares
        
        gl_FragColor = vec4(finalColor + tex.rgb * 0.3, 1.0);
      }
    `
  }), [sunTexture]);

  // 2. SHADER DE CORONA VOLUMÉTRICA (Atmósfera turbulenta)
  const coronaMaterial = useMemo(() => ({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      ${noiseFunction}
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        float noise = snoise(vPosition * 3.0 + uTime * 0.4);
        
        // Efecto de filamentos de plasma
        float alpha = fresnel * (0.5 + noise * 0.5);
        vec3 coronaColor = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 0.8, 0.3), noise);
        
        gl_FragColor = vec4(coronaColor, alpha);
      }
    `
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    photosphereMaterial.uniforms.uTime.value = t;
    // eslint-disable-next-line react-hooks/immutability
    coronaMaterial.uniforms.uTime.value = t;
    
    // Pulsación sutil
    const pulse = 1 + Math.sin(t * 0.5) * 0.005;
    mainMesh.current.scale.set(pulse, pulse, pulse);
    
    // Rotación lenta
    mainMesh.current.rotation.y += 0.001;
  });

  return (
    <group>
      {/* CAPA 1: Fotosfera (Superficie) */}
      <mesh ref={mainMesh}>
        <sphereGeometry args={[radius, 128, 128]} />
        <shaderMaterial {...photosphereMaterial} />
      </mesh>

      {/* CAPA 2: Corona (Halo dinámico) */}
      <mesh ref={coronaMesh} scale={1.05}>
        <sphereGeometry args={[radius, 128, 128]} />
        <shaderMaterial 
          {...coronaMaterial} 
          transparent 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* CAPA 3: Brillo Atmosférico (Glow suave exterior) */}
      <mesh ref={glowMesh} scale={1.4}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial 
          color="#ff4400" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Iluminación Física */}
      <pointLight 
        intensity={intensity} 
        distance={2000} 
        decay={0} 
        color="#FFF5E1" 
      />

      {/* God Rays / Flare indirecto con PointLight adicional suave */}
      <pointLight intensity={intensity * 0.2} distance={radius * 10} color="#ffaa00" />
    </group>
  );
};