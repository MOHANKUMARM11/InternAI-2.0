import { Student } from './student.model.js'

export const studentRepo = {
  create: async (data) => await Student.create(data),
  findByUserId: async (userId) => await Student.findOne({ userId }),
  updateByUserId: async (userId, update) => await Student.findOneAndUpdate({ userId }, update, { new: true }),
  findById: async (id) => await Student.findById(id)
}
