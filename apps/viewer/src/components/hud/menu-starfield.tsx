import { useEffect, useRef } from "react";
import * as THREE from "three";
import earthTextureUrl from "@/assets/earth_daymap.jpg"
import starsUrl from "@/assets/stars_milky_way.jpg";

export function MenuStarfield() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    camera.position.set(-2, 0.5, 6);
    camera.lookAt(1.5, 0, 0);

    new THREE.TextureLoader().load(starsUrl, (tex) => {
      const rt = new THREE.WebGLCubeRenderTarget(1024);
      rt.fromEquirectangularTexture(renderer, tex);
      scene.background = rt.texture;
      tex.dispose();
    });

    const planetMat = new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0 });

    new THREE.TextureLoader().load(earthTextureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      planetMat.map = tex;
      planetMat.needsUpdate = true;
    });

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 64, 64),
      planetMat
    );
    planet.position.set(2.2, -0.3, 0);
    scene.add(planet);

    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color(0x4488ff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float alpha = pow(rim, 2.8) * 0.7;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 64, 64),
      atmoMat
    );
    atmo.position.copy(planet.position);
    scene.add(atmo);

    const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.5);
    sunLight.position.set(8, 2, 4);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x111133, 1.2);
    scene.add(ambientLight);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    let rafId: number;

    function animate() {
      rafId = requestAnimationFrame(animate);
      planet.rotation.y += 0.0008; 
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    />
  );
}