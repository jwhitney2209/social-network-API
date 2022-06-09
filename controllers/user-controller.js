const { User, Thought } = require('../models');

const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one user by id and populate thought and friend data
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({ path: 'thoughts' })
      .populate({ path: 'friends' })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // update one user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // delete one user by id use $pull to remove associated thoughts
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with that id!' });
          return;
        }
      // remove user from friends list
        User.updateMany(
          { _id: { $in: dbUserData.friends } },
          { $pull: { friends: params.id } }
        )
        .then(() => {
          // remove users thoughts
          Thought.deleteMany({ username: dbUserData.username })
          .then(() => {
            res.json({ message: 'Successfully deleted user' });
          })
          .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  },

  // add friend to friends list
  addFriend({ params }, res) {
    // add friend to user's friends list
    User.findOneAndUpdate(
      { _id: params.id },
      { $addToSet: { friends: params.friendId } },
      { new: true }
      )
      .populate({path: 'friends', select: ('-__v')})
      .select('-__v')
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with that id!' });
          return;
        }
        // add user to friend's friends list
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
        )
        .then(dbUserData2 => {
          if (!dbUserData2) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        }) 
        .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  },

  // remove friend from friends list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true }
      )
      .populate({path: 'friends', select: ('-__v')})
      .select('-__v')
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with that id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  }
};

module.exports = userController;