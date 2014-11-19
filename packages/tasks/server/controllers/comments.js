'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  _ = require('lodash');


/**
 * Find comment by id
 */
exports.comment = function(req, res, next, id) {
  Comment.load(id, function(err, comment) {
    if (err) return next(err);
    if (!comment) return next(new Error('Failed to load comment ' + id));
    req.comment = comment;
    next();
  });
};

/**
 * Create a comment
 */
exports.create = function(req, res) {
  var comment = new Comment(req.body);
  comment.task_related = req.body.task._id;
  comment.commented_by = req.body.user._id;
  comment.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the comment'
      });
    }
    res.json(comment);

  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var comment = req.comment;

  comment = _.extend(comment, req.body);

  comment.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the comment'
      });
    }
    res.json(comment);

  });
};

/**
 * Delete a task
 */
exports.destroy = function(req, res) {
  var comment = req.comment;

  comment.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the comment'
      });
    }
    res.json(comment);

  });
};

/**
 * Show a comment
 */
exports.show = function(req, res) {
  res.json(req.comment);
};

/**
 * List of Comments
 */
exports.all = function(req, res) {
  Comment.find({ task_related: req.query.task_related}).sort('-created')
  .populate('task', 'task name')
  .exec(function(err, comments) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the comments'
      });
    }
    res.json(comments);

  });
};