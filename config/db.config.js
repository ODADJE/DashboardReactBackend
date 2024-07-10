const mongoose = require('mongoose');
const User = require('../models/user.model');

// Creates an admin user if it doesn't exist
const createAdmin = async () => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      await User.create([
        {
          name: process.env.NAME,
          email: process.env.EMAIL,
          password: process.env.PASSWORD,
          role: process.env.ROLE,
        },
      ]);
      console.log('Admin created');
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Connects to the MongoDB database using the provided URI.
 * If the connection is successful, logs a message to the console.
 * If the connection fails, logs the error and exits the process.
 *
 * @return {Promise<void>} A promise that resolves when the connection is established.
 */
module.exports = function dbConfig() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB Connected');
      createAdmin();
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
