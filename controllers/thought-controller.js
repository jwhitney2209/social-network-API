const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  getAllThought(req, res) {
    Thought.find({})
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      })
  },
  // get one thought by id 
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData)
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  // create thought
  createThought({ body }, res) {
    Thought.create(body)
    .then((dbThoughtData) => {
      return User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      ) // write then/catch
    })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => res.json(err));
  },
  //update thought
  updateThought() {},
  // delete thought by id
  deleteThought() {},
  // add reaction to thought
  addReaction() {},
  // delete reaction to thought by id
  deleteReaction() {}
};

module.exports = thoughtController;