import type { SessionStatus } from "@prisma/client";

export const ALLOWED_STATUS_TRANSITIONS: Record<
  SessionStatus,
  SessionStatus[]
> = {
  DRAFT: ["READY"],
  READY: ["RUNNING", "DRAFT"],
  RUNNING: ["FINISHED"],
  FINISHED: [],
};

export const isStatusTransitionAllowed = (
  from: SessionStatus,
  to: SessionStatus,
) => {
  if (from === to) return true;
  return ALLOWED_STATUS_TRANSITIONS[from].includes(to);
};
