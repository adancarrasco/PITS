'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  _ = require('lodash'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport');


/**
 * Find task by id
 */
exports.task = function(req, res, next, id) {
  Task.load(id, function(err, task) {
    if (err) return next(err);
    if (!task) return next(new Error('Failed to load task ' + id));
    req.task = task;
    next();
  });
};

var taskNamespace = taskNamespace || {};

/**
 * Create a task
 */
exports.create = function(req, res) {
  var task = new Task(req.body);
  task.assigned_to = req.body.assigned_to;
  task.report_to = req.body.report_to;
  task.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the task'
      });
    }

    taskNamespace.sendMail('adan.carrasco@hotmail.com', 'test', 'test text', '<h3>test html</h3>');

    res.json(task);

  });
};

taskNamespace.sendMail = function(to, subject, text, html) {
  var transporter = nodemailer.createTransport(smtpTransport({
      //service: 'gmail',
      port: 25,
      host: 'mail.adancarrasco.com',
      auth: {
          user: 'hello@adancarrasco.com',
          password: 'cacapopo87!'
      }
  }));
  transporter.sendMail({
    from: 'hello@adancarrasco.com', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plaintext body
    html: html // html body
  }, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};

/**
 * Update a task
 */
exports.update = function(req, res) {
  var task = req.task;

  task = _.extend(task, req.body);

  task.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the task'
      });
    }
    res.json(task);

  });
};

/**
 * Delete a task
 */
exports.destroy = function(req, res) {
  var task = req.task;

  task.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the task'
      });
    }
    res.json(task);

  });
};

/**
 * Show a task
 */
exports.show = function(req, res) {
  res.json(req.task);
};

/**
 * List of Tasks
 */
exports.all = function(req, res) {
  Task.find().sort('-created')
  .populate('assigned_to', 'name username')
  .populate('report_to', 'name username').exec(function(err, tasks) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the tasks'
      });
    }
    res.json(tasks);

  });
};
