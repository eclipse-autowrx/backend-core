const mongoose = require('mongoose');

const timestamp = mongoose.Schema(
  {
    _seconds: {
      type: Number,
      required: true,
    },
    _nanoseconds: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

module.exports = {
  timestamp,
};
