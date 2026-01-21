import type { Request, Response, NextFunction } from "express";
import Joi from "joi";

type ValidateTarget = "body" | "params" | "query";

export const validate =
  (schema: Joi.ObjectSchema, target: ValidateTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    let data: unknown;
    switch (target) {
      case "params":
        data = req.params;
        break;
      case "query":
        data = req.query;
        break;
      case "body":
        data = req.body;
        break;
      default:
        data = req.body;
        break;
    }
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const err = new Error(error.details.map((d) => d.message).join(", "));
      (err as any).status = 400;
      return next(err);
    }

    if (target === "body") req.body = value;
    if (target === "params") req.params = value;
    if (target === "query") res.locals.query = value;
    next();
  };
