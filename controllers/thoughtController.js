const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      return res.json(thoughts);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Error found while fetching thoughts" });
    }
  },

  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      return res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error found while fetching the thought" });
    }
  },

  // Create a thought
  async createThought(req, res) {
    try {

      const { thoughtText , userId}  = req.body;
      if (!thoughtText || !userId) {
        return res.status(400).json({ message: 'Thought text and user ID are required' });
      }
      
      const user = await User.findById(userId);
      if (!user){
        return res.status(400).json({ message: 'No user found with that ID' });
      }

      const thought = await Thought.create(req.body);

      const userUpdate = await User.findByIdAndUpdate ( 
        userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );


      if (!userUpdate){
        return res.status(404).json({ message: 'No user found, thought can not be added' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error found while creating the thought' });
    }
  },

// Update a thought
async updateThought(req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$set: req.body},
      {runValidators: true, new: true}
    );


    if (!thought) {
      return res.status(404).json({ message: 'Thought not found with that ID' });
    }

    res.json(thought);
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Error found while updating the thought' });
  }
},


// Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found with that ID'});
      }


      await User.updateOne(
        {thought: thought._id },
        { $pull: {thought: thought._id } }
        );

      return res.json({ message: 'Thought deleted'});

    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error found while deleting the thought' });
      }
  },

  // Add a reaction to a thought
  async addReaction(req, res) {
    try {

      const { reactionBody , username}  = req.body;
      if (!reactionBody || !username) {
        return res.status(400).json({ message: 'Reaction body and username are required' });
      }
      
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        {runValidators: true, new: true }
      );


      if (!thought){
        return res.status(404).json({ message: 'No thought found with that ID' });
      }


      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error found while adding the reaction' });
    }
  },

  // Remove a reaction
  async removeReaction(req, res) {
    try {

      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: {reactions: { reactionId: req.body.reactionId } } },
        );



      if (!thought) {
        return res.status(404).json({ message: 'Thought not found with that ID'});
      }


      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error found while deleting the reaction' });
      }
  },
};
