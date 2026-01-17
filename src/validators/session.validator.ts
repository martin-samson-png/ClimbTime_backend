import Joi from "joi";

export const sessionCreateSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "any.required": "Le nom est obligatoire.",
    "string.empty": "Le nom est obligatoire.",
  }),
  city: Joi.string().trim().required().messages({
    "any.required": "La ville est obligatoire.",
    "string.empty": "La ville est obligatoire.",
  }),
  startedAt: Joi.date().iso().required().messages({
    "any.required": "La date de début est obligatoire.",
    "date.base": "La date de début est invalide.",
    "date.format": "La date de début est invalide.",
  }),
  endedAt: Joi.date().iso().required().messages({
    "any.required": "La date de fin est obligatoire.",
    "date.base": "La date de fin est invalide.",
    "date.format": "La date de fin est invalide.",
  }),
});
