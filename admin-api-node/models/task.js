const Joi = require('joi');
const mongoose = require('mongoose');

const Task = mongoose.model('Task', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 3,
    maxlength: 255
  },
  description: {
    type: String,
    required: true,
    trim: true, 
    maxlength: 255
  },
  status: {
    type: String,
    required: true,
    trim: true, 
    maxlength: 255
  },
  comment: {
    type: String,
    required: true,
    trim: true, 
    maxlength: 255
  },
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
  }

}, {
  timestamps: true
}));

function validateTask(task) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    comment: Joi.string().required(),
    owner: Joi.string().required()
  });

  return schema.validate(task);
}

exports.Task = Task; 
exports.validate = validateTask;