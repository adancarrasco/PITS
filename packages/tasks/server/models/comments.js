'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	commented_by: {
	    type: Schema.Types.ObjectId,
	    ref: 'User'
	},
	task_related:{
		type: Schema.Types.ObjectId,
	 	ref: 'Task'
	},
	message:{
	 	type: String,
	 	required: true
	},
	created:{
	 	type: Date,
	 	default: Date.now
	},
	edited:{
	 	type: Boolean,
	 	default: false
	},
	linked_to:{
	 	type: Schema.Types.ObjectId,
	 	ref: 'Comment'
	}
});

/**
 * Validations
 */
CommentSchema.path('message').validate(function(comment) {
  return !!comment;
}, 'Comment cannot be blank');

/*CommentSchema.path('description').validate(function(description) {
  return !!description;
}, 'Description cannot be blank');*/

/**
 * Statics
 */
CommentSchema.statics.load = function(id, cb) { //Investigate this part
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Comment', CommentSchema);