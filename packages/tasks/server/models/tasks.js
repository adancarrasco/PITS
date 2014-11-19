'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Task Schema
 */
var TaskSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed_by:{
    type: Date,
    required: true
  },
  last_edit_date:{
    type: Date,
    default: Date.now
  },
  brd_url:{
    type: String,
    required: true
  },
  report_to:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: String,
    required: true
  },
  type:{
    type: String,
    required: true
  },
  time:{
    type: Number,
    required: true
  },
  project:{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }
});

/**
 * Validations
 */
TaskSchema.path('name').validate(function(name) {
  return !!name;
}, 'Task name cannot be blank');

TaskSchema.path('description').validate(function(description) {
  return !!description;
}, 'Description cannot be blank');

/**
 * Statics
 */
TaskSchema.statics.load = function(id, cb) { //Investigate this part
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Task', TaskSchema);
