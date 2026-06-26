// Physics simulation constants for the Rope Elevator canvas animations

export const PHYSICS = {
  LERP_FACTOR: 0.08,             // Easing factor for vertical cabin transition
  PENDULUM_SWAY_SPEED: 0.02,     // Natural sway frequency
  PENDULUM_SWAY_AMP: 0.8,        // Amplitude of slow pendulum sway
  VELOCITY_SWAY_SPEED: 0.12,     // Inertia sway frequency
  VELOCITY_SWAY_AMP: 0.05,       // Amplitude of sway driven by velocity changes
  VIBRATION_THRESHOLD: 1.5,      // Velocity limit above which cable starts shuddering
  VIBRATION_SPEED: 0.6,          // High frequency cable vibration speed
  VIBRATION_AMP: 0.3,            // Shudder amplitude
  TILT_FACTOR: 0.6,              // Rotational tilt scaling factor
  MAX_TILT: 3,                   // Maximum cabin swing angle (degrees)
};

export const DEPLOYMENT = {
  TOTAL_DURATION: 1800,          // Drop animation time (ms)
  SETTLE_DELAY: 1300,            // Time after which spring settles (ms)
  SETTLE_SPEED: 500,             // Settle duration (ms)
  SETTLE_FREQ_MULTIPLIER: 6,     // Oscillation speed during settle bounce
  SETTLE_AMP_FACTOR: 12,         // Max settle spring distance
};

export const DOORS = {
  OPEN_SPEED: 0.03,              // Ratio added per animation frame (0 to 1)
  CLOSE_SPEED: 0.04,             // Ratio subtracted per animation frame (0 to 1)
};

export const CHARACTERS = {
  WALK_SPEED_DELTA: 0.8,         // Speed walking out to the lobby
  RUN_SPEED_DELTA: 1.8,          // Speed running back inside cabin
  WALK_LEG_SPEED: 1.2,           // Leg swing animation speed (walk)
  RUN_LEG_SPEED: 2.2,            // Leg swing animation speed (run)
  WALK_BOB_AMP: -1.5,            // Torso bob height during walk cycle
};
