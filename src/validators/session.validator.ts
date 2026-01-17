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

export const sessionUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Le nom est obligatoire.",
    "string.min": "Le nom ne peut pas être vide.",
  }),
  city: Joi.string().trim().min(1).optional().messages({
    "string.empty": "La ville est obligatoire.",
    "string.min": "La ville ne peut pas être vide.",
  }),
  startedAt: Joi.date().iso().optional().messages({
    "date.base": "La date de début est invalide.",
    "date.format": "La date de début est invalide.",
  }),
  endedAt: Joi.date().iso().optional().messages({
    "date.base": "La date de fin est invalide.",
    "date.format": "La date de fin est invalide.",
  }),
})
  .min(1)
  .required()
  .messages({
    "any.required": "Body obligatoire.",
    "object.min": "Au moins un champ doit être fourni.",
  });
