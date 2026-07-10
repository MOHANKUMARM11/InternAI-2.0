const Student = require("../../models/Student");

const getMyProfile = async (userId) => {
  return await Student.findOne({ userId }).populate(
    "userId",
    "name email role"
  );
};

const updateMyProfile = async (userId, data) => {
  return await Student.findOneAndUpdate(
    { userId },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("userId", "name email role");
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};