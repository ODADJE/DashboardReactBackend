const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

exports.polishUserToSend = (user, ...fieldsToRemove) => {
  if (Array.isArray(user)) {
    return user.map((user) => polishUserToSend(user, ...fieldsToRemove));
  }
  const userToSend = user.toObject();
  fieldsToRemove.forEach((field) => (userToSend[field] = undefined));
  return userToSend;
};

/**
 * Middleware function to remove the password field from the request body and send an error if it exists.
 *
 * @param {Object} body - The request body.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
exports.polishBody = (body) => (req, res, next) => {
  if (body.password) {
    body.password = undefined;
    next(new AppError('This route is not for password updates', 400));
  }
  req.body = body;
  next();
};

/**
 * Sends a JSON response with the given user data and status code.
 *
 * @param {Object} user - The user object to be included in the response.
 * @param {number} statusCode - The HTTP status code to be used in the response.
 * @param {Object} res - The response object.
 * @return {Object} The JSON response with the user data and status code.
 */
const sendUser = (user, statusCode, res) => {
  return res.status(statusCode).json({
    status: 'success',
    results: user.length,
    data: {
      user: polishUserToSend(user, 'password', 'updatedAt', '__v'),
    },
  });
};

/**
 * Gets all users from the database and sends a JSON response with the user data and status code.
 * @route GET /api/users
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response with the user data and status code.
 */
exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find();
  return sendUser(users, 200, res);
});

/**
 * Gets a single user from the database and sends a JSON response with the user data and status code.
 * @route GET /api/users/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response with the user data and status code.
 */
exports.getOne = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  return sendUser(user, 200, res);
});

/**
 * Creates a new user in the database and sends a JSON response with the user data and status code.
 * @route POST /api/users
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response with the user data and status code.
 */
exports.create = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  return sendUser(user, 201, res);
});

/**
 * Updates a user in the database and sends a JSON response with the updated user data and status code.
 *@route PUT /api/users/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response with the updated user data and status code.
 */
exports.update = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return sendUser(user, 200, res);
});

/**
 * Deletes a user from the database and sends a JSON response with the deleted user data and status code.
 *@route DELETE /api/users/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response with the deleted user data and status code.
 */
exports.delete = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  return sendUser(user, 204, res);
});
