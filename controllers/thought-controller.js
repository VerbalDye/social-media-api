const { User, Thought } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getThoughtById({ params }, res) {
        Thought.find({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(dbThoughtData => {
                User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true, runValidators: true }
                )
                    .then(dbUserData => res.json([dbUserData, dbThoughtData]))
            })
            .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findByIdAndDelete({ _id: params.id })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    deleteReaction({ params }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
}

module.exports = thoughtController