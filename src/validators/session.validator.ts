import { SessionStatus } from "@prisma/client";
import Joi from "joi";

const sessionStatus = Object.values(SessionStatus) as string[];

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

export const sessionSetStatusBodySchema = Joi.object({
  status: Joi.string()
    .valid(...sessionStatus)
    .required()
    .messages({
      "any.required": "Le statut est obligatoire",
      "string.base": "Format invalide",
      "any.only": "Le statut est invalide",
    }),
});

export const sessionIdParamsSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "any.required": "Id manquant.",
    "string.guid": "Id invalide.",
    "string.base": "Id invalide.",
  }),
});

export const sessionFindSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "page doit être un nombre",
    "number.integer": "page doit être un entier",
    "number.min": "page doit être >= 1",
  }),
  limit: Joi.number().integer().min(1).max(50).default(20).messages({
    "number.base": "limit doit être un nombre",
    "number.integer": "limit doit être un entier",
    "number.min": "limit doit être >= 1",
    "number.max": "limit ne doit pas dépasser 50",
  }),
  status: Joi.string()
    .valid(...sessionStatus)
    .optional()
    .messages({
      "string.base": "Format invalide",
      "any.only": "Le status est invalide",
    }),
  city: Joi.string().trim().min(1).max(80).optional().messages({
    "string.base": "city doit être une chaîne",
    "string.min": "city ne peut pas être vide",
    "string.max": "city est trop long (80 max)",
  }),
  q: Joi.string().trim().min(1).max(80).optional().messages({
    "string.base": "q doit être une chaîne",
    "string.min": "q ne peut pas être vide",
    "string.max": "q est trop long (80 max)",
  }),
  startedAtFrom: Joi.date().iso().optional().messages({
    "date.base": "startedAtFrom doit être une date valide",
    "date.format": "startedAtFrom doit être au format ISO",
  }),
  startedAtTo: Joi.date().iso().optional().messages({
    "date.base": "startedAtTo doit être une date valide",
    "date.format": "startedAtTo doit être au format ISO",
  }),
  sortBy: Joi.string()
    .valid("startedAt", "createdAt", "name", "city", "status")
    .default("startedAt")
    .messages({
      "string.base": "sortBy doit être une chaîne",
      "any.only": "sortBy invalide",
    }),
  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "string.base": "sortOrder doit être une chaîne",
    "any.only": "sortOrder doit être 'asc' ou 'desc'",
  }),
})
  .custom((value, helpers) => {
    const { startedAtFrom, startedAtTo } = value;

    if (startedAtFrom && startedAtTo && startedAtFrom > startedAtTo)
      return helpers.error("any.custom");

    return value;
  })
  .messages({
    "any.custom": "startedAtFrom doit être supérieur ou égal à startedAtTo",
  });
