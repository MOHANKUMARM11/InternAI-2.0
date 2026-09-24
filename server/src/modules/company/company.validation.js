import Joi from 'joi'

export const updateCompanySchema = Joi.object({
  companyName: Joi.string().allow(''),
  industry: Joi.string().allow(''),
  description: Joi.string().allow(''),
  website: Joi.string().uri().allow(''),
  size: Joi.string().valid('1-10', '11-50', '51-200', '200+').allow(''),
  location: Joi.string().allow(''),
  cultureValues: Joi.array().items(Joi.string()).min(3).message('Minimum 3 culture values are required').allow(null),
  workStyle: Joi.string().valid('remote', 'onsite', 'hybrid').allow('')
})
