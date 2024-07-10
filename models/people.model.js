const mongoose = require('mongoose');
const validator = require('validator');
const peopleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [50, 'Name can not be more than 50 characters'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please add a date of birth'],
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Others'],
        message: 'Please select a valid gender',
      },
      required: [true, 'Please add a gender'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please add a valid email',
      },
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      // validate: {
      //   validator: validator.isMobilePhone,
      //   message: 'Please add a valid phone number',
      // },
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    cardNumber: {
      type: String,
      required: [true, 'Please add a card number'],
      unique: true,
    },
    photo: {
      type: String,
      required: [true, 'Please add a photo'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    typeOfPerson: {
      type: String,
      defaut: 'client',
      enum: {
        values: ['client', 'owner'],
        message: 'Please select a valid type of person (client or owner)',
      },
      required: [true, 'Please add a type of person (client or owner)'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const People = mongoose.model('People', peopleSchema);
module.exports = People;
