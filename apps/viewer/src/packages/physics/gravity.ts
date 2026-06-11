import type { Body } from "@/packages/physics/body"
import type { Vector3 } from "@/packages/physics/body";

const G = 4 * Math.PI ** 2;

function zero(): Vector3 {
  return [0, 0, 0];
}

function add(a: Vector3, b: Vector3): Vector3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub(a: Vector3, b: Vector3): Vector3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(v: Vector3, s: number): Vector3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function lengthSq(v: Vector3): number {
  return v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
}

/**
 * Computes acceleration on body i due to body j
 */
function computeAcceleration(a: Body, b: Body): Vector3 {
  const dx = sub(b.position, a.position);

  const distSq = lengthSq(dx) + 0.0001; // evitar división por 0
  const dist = Math.sqrt(distSq);

  const force = (G * b.mass) / distSq;

  return scale(dx, force / dist);
}

/**
 * Computes all accelerations in the system (N-body)
 */
export function computeAccelerations(bodies: Body[]): Vector3[] {
  const acc: Vector3[] = bodies.map(() => zero());

  for (let i = 0; i < bodies.length; i++) {
    for (let j = 0; j < bodies.length; j++) {
      if (i === j) continue;

      const a = computeAcceleration(bodies[i], bodies[j]);

      acc[i] = add(acc[i], a);
    }
  }

  return acc;
}
