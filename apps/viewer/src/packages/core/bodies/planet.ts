import type { Body } from "@/packages/physics/body";
import type { CelestialData } from "@/lib/constants/astronomy";

export class Planet {
  public body: Body;
  public data: CelestialData;

  constructor(body: Body, data: CelestialData) {
    this.body = body;
    this.data = data;
  }

  // Cálculos lógicos que no dependen de React
  get isStar(): boolean {
    return this.body.type === "star";
  }

  // Ejemplo: calcular distancia al Sol en tiempo real
  public getDistanceToCenter(): number {
    const [x, y, z] = this.body.position;
    return Math.sqrt(x * x + y * y + z * z);
  }
}