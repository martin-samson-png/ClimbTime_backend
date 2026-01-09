export const makeErr = (status: number, message: string) => {
  const err = new Error(message);
  (err as any).status = status;
  return err;
};
