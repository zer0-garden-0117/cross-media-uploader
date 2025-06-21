export const StatusType = {
  PENDING: 'pending',
  POSTED: 'posted',
  FAILED: 'failed',
} as const;

export type StatusType = typeof StatusType[keyof typeof StatusType];

export const AllStatusType = Object.values(StatusType);