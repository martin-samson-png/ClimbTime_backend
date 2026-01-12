import "dotenv/config";
import Joi from "joi";

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("developpement", "production").required(),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  RESEND_API_KEY: Joi.string().required(),
  RESEND_FROM: Joi.string().required(),
  FRONT_URL: Joi.string().uri().required(),
  TOKEN_HMAC_SECRET: Joi.string().min(32).required(),
}).unknown();

const { value, error } = schema.validate(process.env);
if (error) throw new Error(`ENV ERROR : ${error.message}`);

export const env = value;
