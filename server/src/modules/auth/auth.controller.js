const { signupUser, loginUser } = require("./auth.service");

// Controller function to sign up a new user
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

// Controller function to log in a user
const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...data,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};