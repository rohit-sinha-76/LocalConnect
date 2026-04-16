const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    const validRoles = ['customer', 'worker', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
      });
    }

    const result = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const result = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { register, login };
