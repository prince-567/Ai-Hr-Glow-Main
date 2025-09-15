const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false, // optional
  },
  address: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
  salary: {
    type: Number,
    required: false,
  },
  hire_date: {
    type: Date,
    default: Date.now,
  },
  emergency_contact: {
    type: String,
    required: false,
  },
  emergency_phone: {
    type: String,
    required: false,
  },
  user_id: {
    type: String,
    required: false,
  },
}, {
  timestamps: true

});

// Yaha mongoose.model() ka result export karna zaroori hai
module.exports = mongoose.model("User", userSchema);



    