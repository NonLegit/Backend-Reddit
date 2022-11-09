const mongoose = require('mongoose');
const validator = require('validator');

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.SchemaType.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.SchemaType.ObjectId,
        ref: 'Post',
        required: true,
    },
    mentions: [
        {
            type: mongoose.SchemaType.ObjectId,
            ref: 'User',
        },
    ],
    replies: [
        {
            type: mongoose.SchemaType.ObjectId,
            ref: 'Comment',
        },
    ],
    parent: {
        type: mongoose.SchemaType.ObjectId,
        refPath: 'parentModel',
    },
    parentModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment'],
        default: 'Comment',
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    votes: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;