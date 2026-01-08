import type { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const err = new Error(error.details.map((d) => d.message).join(", "));
      (err as any).status = 400;
      return next(err);
    }

    req.body = value;
    next();
  };
