const mongoose = require('mongoose');
const People = require('../models/people.model');
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
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
