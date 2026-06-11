import type { Body } from "@/packages/physics/body"
import { computeAccelerations } from "@/packages/physics/gravity";

// integrator.ts (Velocity Verlet)
export function step(bodies: Body[], dt: number) {
  // 1. Calcular aceleraciones actuales
  const acc1 = computeAccelerations(bodies);

  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const a = acc1[i];

    // 2. Actualizar posición: x = x + v*dt + 0.5*a*dt^2
    b.position[0] += b.velocity[0] * dt + 0.5 * a[0] * dt * dt;
    b.position[1] += b.velocity[1] * dt + 0.5 * a[1] * dt * dt;
    b.position[2] += b.velocity[2] * dt + 0.5 * a[2] * dt * dt;
    
    // Guardamos la v actual para el paso de velocidad final
    b.velocity[0] += 0.5 * a[0] * dt;
    b.velocity[1] += 0.5 * a[1] * dt;
    b.velocity[2] += 0.5 * a[2] * dt;
  }

  // 3. Recalcular aceleraciones con las NUEVAS posiciones
  const acc2 = computeAccelerations(bodies);

  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const newA = acc2[i];

    // 4. Completar el paso de velocidad: v = v_half + 0.5*newA*dt
    b.velocity[0] += 0.5 * newA[0] * dt;
    b.velocity[1] += 0.5 * newA[1] * dt;
    b.velocity[2] += 0.5 * newA[2] * dt;
  }
}