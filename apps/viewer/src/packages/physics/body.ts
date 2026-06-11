/**
 * Represents a 3D vector in Cartesian space.
 * Tuple format is used for performance and simplicity.
 *
 * Indices:
 * [0] = x
 * [1] = y
 * [2] = z
 */
export type Vector3 = [number, number, number];

/**
 * Represents a physical body in the orbital simulation.
 * This is the minimal state required to integrate motion
 * under Newtonian gravity.
 *
 * Note:
 * Rendering-related properties (mesh, color, etc.) should NOT be included here.
 * This belongs strictly to the physics/core layer.
 */
export type Body = {
  /**
   * Current position in 3D space (arbitrary units).
   * Keep a consistent scale across the simulation.
   */
  position: Vector3;

  name: string;
  
  /**
   * Current linear velocity (units per second).
   * Used by numerical integrators (Verlet, RK4, etc.).
   */
  velocity: Vector3;

  /**
   * Mass of the body.
   * Directly affects gravitational interaction:
   * F = G * (m1 * m2) / r^2
   */
  mass: number;

  /**
   * Unique identifier (useful for UI, selection, debugging)
   */
  id: string;

/**
 * Optional classification of the body
 */
type?: "star" | "planet" | "asteroid";
};