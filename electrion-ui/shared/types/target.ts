export const TargetType = {
  ASB: 'asb',
  X: 'x',
  BLUESKY: 'bluesky',
} as const;

export type TargetType = typeof TargetType[keyof typeof TargetType];

export const AllTargetType = Object.values(TargetType);