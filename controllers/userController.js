const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.findd();
      return res.json(users);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json(err);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts')
        .populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' })
      }

      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a user
async updateUser(req, res) {
  try {
    const user = await User.findOneAndUpdate(
      {_id: req.params.userId},
      {$set: req.body},
      {runValidators: true, new: true}
    );
    
    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' })
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
},

// Delete a user
async deleteUser(req, res) {
  try {
    const student = await User.findOneAndRemove({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'No such user exists' });
    }


    if (!user.thoughts.lenght > 0) {
      await Thought.deleteMany({_id: {$in: user.thoughts}});
    }

    return res.json({ message: 'User and associated thoughts successfully deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
},

// Add an friend to a user
async addFriend(req, res) {
  try {

    if (req.params.userId === req.params.friendId) {
      return res.status(404).json({ message: 'You can not add yourself as a friend :(' });
    }


  const newFriend = await User.findById(req.params.friendId);
  if(!newFriend){
    return res.status(404).json({ message: 'No user with that ID found' });
  }

  const user = await User.findById(req.params.userId);


  if (!user){
    return res.status(404).json({ message: 'No user with that ID found' });
  }

  if (user.friends.includes(req.params.friendId)){
    return res.status(400).json({ message: 'Friend alredy added' });
  }


  user.friend.push(req.params.friendId);
  await user.save();


  const populateUser = await User.findById(req.params.userId)
    .populate({
      path: 'friends',
      select:  '_id username'
    });
  

    res.json(student);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
},


// Remove a friend from an user
async removeFriend(req, res) {
  try {

    const deleteFriend = await User.findById(req.params.friendId);
    if (!deleteFriend) {
      return res.status(404).json({ message: 'No user found with that ID :(' });
    }

    const user = await User.findById(req.params.userId);


    if(!user){
      return res.status(404).json({ message: 'No user found with that ID :(' });
    }


    if(!user.friends.includes(req.params.friendId)){
      return res.status(400).json({ message: 'You are not a friend :(' });
    }

    //Remove the friend to the list
    const indexToRemove = user.friends.indexOf(req.params.userId)
    user.friends.splice(indexToRemove, 1);
    await user.save();


    const populateUser = await User.findById(req.params.userId)
      .popute({
        path: 'friends',
        select: '_id username'
      })

    res.json(populateUser);
    
  } catch (err) {
    res.status(500).json(err);
  }
},
};


  









// Aggregate function to get the number of students overall
const headCount = async () => {
  const numberOfStudents = await Student.aggregate()
    .count('studentCount');
  return numberOfStudents;
}

// Aggregate function for getting the overall grade using $avg
const grade = async (studentId) =>
  Student.aggregate([
    // only include the given student by using $match
    { $match: { _id: new ObjectId(studentId) } },
    {
      $unwind: '$assignments',
    },
    {
      $group: {
        _id: new ObjectId(studentId),
        overallGrade: { $avg: '$assignments.score' },
      },
    },
  ]);

