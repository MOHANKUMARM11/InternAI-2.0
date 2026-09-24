import Joi from 'joi'

export const updateProfileSchema = Joi.object({
  college: Joi.string().allow(''),
  cgpa: Joi.number().min(0).max(10).allow(null),
  skills: Joi.array().items(Joi.string()).allow(null),
  education: Joi.array().items(
    Joi.object({
      degree: Joi.string(),
      institution: Joi.string(),
      year: Joi.number(),
      percentage: Joi.number()
    })
  ).allow(null),
  projects: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      techStack: Joi.array().items(Joi.string()),
      link: Joi.string()
    })
  ).allow(null),
  experience: Joi.array().items(
    Joi.object({
      role: Joi.string(),
      company: Joi.string(),
      duration: Joi.string(),
      description: Joi.string()
    })
  ).allow(null),
  portfolioLinks: Joi.object({
    github: Joi.string().allow(''),
    linkedin: Joi.string().allow(''),
    website: Joi.string().allow('')
  }).allow(null),
  careerGoal: Joi.string().allow(''),
  preferredDomains: Joi.array().items(Joi.string()).allow(null)
})
