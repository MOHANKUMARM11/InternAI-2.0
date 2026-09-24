import { User } from './user.model.js'

export const authRepo = {
  findByEmail: async (email) => await User.findOne({ email }),
  create: async (data) => await User.create(data)
}
