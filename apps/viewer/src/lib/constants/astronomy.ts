import EarthTexture from "@/assets/earth_daymap.jpg"
import SunTexture from "@/assets/2k_sun.jpg"

export interface CelestialData {
  eccentricity: number;
  name: string;
  mass: number;
  radius: number;
  color: number;
  semiMajorAxis?: number;
  orbitalVelocity?: number;
  axialTilt?: number;
  rotationSpeed?: number;
  textureUrl?: string;
}

export const EARTH_DATA: CelestialData = {
  name: "Earth",
  mass: 3.003e-6,
  // RADIO FÍSICO REAL (4.26e-5 UA)
  radius: 4.26352e-5,
  semiMajorAxis: 1.0,
  orbitalVelocity: 6.283185,
  axialTilt: 23.439,
  // ROTACIÓN REAL (Vueltas por año)
  rotationSpeed: 0.1,
  color: 0x2277ff,
  textureUrl: EarthTexture,
  eccentricity: 0.0167,
};

export const SUN_DATA: CelestialData = {
  name: "Sun",
  textureUrl: SunTexture,
  mass: 1.0,           
  // RADIO FÍSICO REAL (0.00465 UA)
  radius: 0.00465,     
  color: 0xffdd00,
  eccentricity: 0,
};