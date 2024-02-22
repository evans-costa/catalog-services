import Joi from 'joi';

export const createCategorySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  owner_id: Joi.number().positive().integer().required(),
});

export const updateCategorySchema = createCategorySchema.fork(['title', 'description'], (schema) => schema.optional());
