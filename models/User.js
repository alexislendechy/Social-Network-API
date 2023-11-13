const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: Number,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address']
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thoughts'
      }
    ],
    friends: {
      type: [{
        type: Schema.Types.ObjectId,

        ref: 'User'
      }],
      default: []
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
      versionKey: false
    },
    toObject: {
      virtuals: true,
      getters: true
    }
  }
);

userSchema.virtual('friendCount').get(function() {
  return this.friends ? this.friends.lenght : 0;
});

const User = model('User', userSchema);

module.exports = Student;
