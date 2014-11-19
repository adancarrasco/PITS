'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  p_id: {
    type: String,
    required: true
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
  release:{
    type: String,
    required: true
  },
  last_edit_date:{
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
ProjectSchema.path('name').validate(function(name) {
  return !!name;
}, 'Project name cannot be blank');

ProjectSchema.path('description').validate(function(description) {
  return !!description;
}, 'Description cannot be blank');

/**
 * Statics
 */
ProjectSchema.statics.load = function(id, cb) { //Investigate this part
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Project', ProjectSchema);
