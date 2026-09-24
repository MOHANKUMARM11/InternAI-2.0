import Joi from 'joi'

export const createInternshipSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  skillsRequired: Joi.array().items(Joi.string()).required(),
  domain: Joi.string().valid('Frontend', 'Backend', 'Full-Stack', 'Data Science', 'ML/AI', 'DevOps', 'Design', 'Marketing', 'Finance', 'HR', 'Other').required(),
  stipend: Joi.number().allow(null),
  duration: Joi.string().allow(''),
  location: Joi.string().allow(''),
  isRemote: Joi.boolean().default(false),
  openings: Joi.number().default(1),
  applyDeadline: Joi.date().allow(null),
  isActive: Joi.boolean().default(true)
})

export const updateInternshipSchema = createInternshipSchema.fork(
  ['title', 'description', 'skillsRequired', 'domain'],
  (schema) => schema.optional()
)
