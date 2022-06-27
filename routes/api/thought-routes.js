const router = require('express').Router();
const { getAllThoughts, getThoughtById, createThought } = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts).post(createThought);
router.route('/:id').get(getThoughtById).put().delete()

module.exports = router;