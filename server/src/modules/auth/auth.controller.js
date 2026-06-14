const { signupUser } = require("./auth.service");

const signup = async (req, res) => {
  try {
    const user = await signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
};