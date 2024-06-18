const express = require('express');
const AppError = require('./utils/appError');
const errorHandler = require('./services/errorHandler');
const userRouter = require('./routes/user.routes');
const morgan = require('morgan');

const app = express();

// Middlewarea
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);

// 404 middleware
app.use('*', (req, res, next) => {
  next(new AppError('This route is not handled', 404));
});

// error handler middleware
app.use(errorHandler);

module.exports = app;
