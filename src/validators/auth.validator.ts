import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "any.required": "L'email est obligatoire",
    "string.empty": "L'email est obligatoire",
    "string.email": "L'email n'est pas valide",
  }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Le mot de passe est obligatoire",
    "string.empty": "Le mot de passe est obligatoire",
    "string.min": "Le mot de passe doit faire au moins {#limit} caractères",
  }),
});
