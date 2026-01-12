import Joi from "joi";

export const adminRegisterSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Le token est obligatoire",
    "string.empty": "Le token est obligatoire",
    "string.base": "Le token doit être une chaine",
  }),
  firstname: Joi.string().trim().min(1).required().messages({
    "any.required": "Le prénom est obligatoire",
    "string.empty": "Le prénom est obligatoire",
  }),
  lastname: Joi.string().trim().min(1).required().messages({
    "any.required": "Le prénom est obligatoire",
    "string.empty": "Le prénom est obligatoire",
  }),
  password: Joi.string().trim().min(8).required().messages({
    "any.required": "Le mot de passe est obligatoire",
    "string.empty": "Le mot de passe est obligatoire",
    "string.min": "Le mot de passe doit faire au moins {#limit} caractères",
  }),
});

export const inviteAdminSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "any.required": "L'email est obligatoire",
    "string.empty": "L'email est obligatoire",
    "string.email": "L'email n'est pas valide",
  }),
  expiresInDays: Joi.number().integer().min(1).max(14).default(7).messages({
    "number.integer": "Le chiffre doit être entier",
    "number.min": "Le chiffre doit être supérieur ou égal à {#limit}",
    "number.max": "Le chiffre doit être inférieur ou égal à {#limit}",
    "number.base": "Le nombre de jours doit être un nombre",
  }),
});
