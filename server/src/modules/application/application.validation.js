import Joi from 'joi'

export const applySchema = Joi.object({
  internshipId: Joi.string().required(),
  coverNote: Joi.string().allow('').optional()
})

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected').required()
})
