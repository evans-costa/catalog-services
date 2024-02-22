import Joi from 'joi';

export const createProductSchema = Joi.object({
  title: Joi.string().required(),
  owner_id: Joi.number().positive().integer().required(),
  description: Joi.string().required(),
  category_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  price: Joi.number().positive().precision(2).prefs({ convert: false }).required(),
});

export const updateProductSchema = createProductSchema.fork(
  ['title', 'description', 'category_id', 'price'],
  (schema) => schema.optional()
);
