const { Schema, model, Types } = require('mongoose');

const ThoughtSchema = Schema(
    {
        thoughtText: {
            type: String 
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        reactions: [],
        username: {
            type: String,
            required: true,
            trim: true
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
)