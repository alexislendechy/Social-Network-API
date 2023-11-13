const { Schema, model } = require('mongoose');
const moment = require('moment');
const reactionSchema = require('./Reaction');

// Schema to create a thught
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamps) => moment(timestamps).format('MMM Do, YYYY [at] hh:mm a')
    },
    username: {
      type: Number,
      required: true,
    },
    rections: [reactionSchema] 
    },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
  }
);

thoughtSchema.virtual('reactionCount').get(function () {
  return this.rections.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Course;
