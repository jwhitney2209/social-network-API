const router = require('express').Router();

const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router
  .route('/')
  .get(getAllThought)

// /api/thoughts/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router
  .route('/:userId').post(createThought)

// /api/thoughts/:thoughtId/reactions
router
  .route('/:thoughtId/reactions')
  .post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId  
router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;