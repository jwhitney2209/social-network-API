const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: 'You need to provide a reaction!',
      maxlength: 280,
      trim: true
    },
    username: {
      type: String,
      required: 'Please enter a username!'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  }
);

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: 'Please provide text!',
      minlength: 1,
      maxlength: 128
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
      type: String,
      required: 'Please enter a username!'
    },
    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
})

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;