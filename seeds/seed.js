const db = require('../config/connection');
const { User, Thought } = require('../models')

const userSeed = [
  { username: 'Aaran', email: 'Aaran@bootcamp.com'},
  { username: 'Aarez', email: 'Aarez@bootcamp.com'},
  { username: 'Aarman', email: 'Aarman@bootcamp.com'},
  { username: 'Aaron', email: 'Aaron@bootcamp.com'},
  { username: 'Aaranza', email: 'Aaranza@bootcamp.com'},
];

const thoughtSeed = [
  {thoughtText: 'In the dance of chaos, find the rhythm of serendipity.', username: 'Aaran' },
  {thoughtText: 'Clouds are natures poetry written across the canvas of the sky.', username: 'Aarez' },
  {thoughtText: 'The best stories are the ones yet to be written in the margins of uncertainty.', username: 'Aarman' },
  {thoughtText: 'Kindness is the compass that guides us through the wilderness of daily interactions.', username: 'Aaron' },
  {thoughtText: 'Silence speaks volumes, but a well-chosen word can build bridges across the quiet.', username: 'Aaranza' },
];

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await Thought.deleteMany({});

    const createUsers = await User.create(userSeed);

    const createdThoughts = await Thought.create(thoughtSeed);

    for (const thought of createdThoughts) {
      const user = createUsers.find((user) => user.username === thought.username);
      if (user) {
        user.thoughts.push(thought._id);
        await user.save();
      }
    }

    console.log('Users', createUsers);
    console.log('Thoughts', createdThoughts);
    console.log('Seeding complete! 🌱');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();