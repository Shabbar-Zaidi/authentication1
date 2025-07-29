const bcrypt = require("bcrypt"); // Used to hash passwords and compare them securely
const jwt = require("jsonwebtoken"); // Used to create and verify JSON Web Tokens (JWT) for authentication
const UserModel = require("../Models/User"); // User model for interacting with the user collection in the database

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email }); // Check if a user with the provided email already exists
    if (user) {
      return res
        .status(409) // 409 Conflict status code indicates that the request could not be completed due to a conflict with the current state of the resource
        .json({
          message: "User is already exist, you can login",
          success: false,
        });
    }
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10 e.g., password123$2b$10$... ->  Salt: $2b$10$...
    await userModel.save(); // Save the new user to the database
    // If the user is successfully created, send a success response
    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err, // Include the error message for debugging purposes
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is wrong";
    if (!user) {
      // Check if user exists
      return res.status(403).json({ message: errorMsg, success: false }); // 403 Forbidden status code indicates that the server understands the request but refuses to authorize it
    }
    const isPassEqual = await bcrypt.compare(password, user.password); // Compare the provided password from the client with the hashed password stored in the database
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id }, // Payload for the JWT token, containing the user's email and ID
      // The secret key used to sign the JWT token, should be stored in an environment variable
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Token expiration time set to 24 hours e.g., 24h, 1d, 1h, 1m, 1s
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name, // Include the user's name in the response
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err,
    });
  }
};

module.exports = {
  signup,
  login,
};
