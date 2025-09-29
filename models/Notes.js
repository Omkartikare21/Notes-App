const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxlength: [40, "Title must be at most 40 characters long"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.models.Note || mongoose.model('Note', NoteSchema);