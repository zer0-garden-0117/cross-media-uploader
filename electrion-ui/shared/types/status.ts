export const StatusType = {
  SMALL: 'pending',
  MEDIUM: 'posted',
  LARGE: 'failed',
} as const;

export type StatusType = typeof StatusType[keyof typeof StatusType];

export const AllStatusType = Object.values(StatusType);