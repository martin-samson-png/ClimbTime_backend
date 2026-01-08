import Joi from "joi";

//ajouter les messages customs

export const adminRegisterSchema = Joi.object({
  token: Joi.string().required(),
  firstname: Joi.string().min(1).required(),
  lastname: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
