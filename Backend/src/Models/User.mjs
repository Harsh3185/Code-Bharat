import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['User' , 'Admin'],
        required: true,
    },
    profilePicture: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    institution: {
        type: String,
        default: null
    },

    problemsSolved: {
        type: [Number],
        default: []
    },
    totalSubmissions: {
        type: Number,
        default: 0
    },
    acceptedSubmissions: {
        type: Number,
        default: 0
    }
});

export const User = new mongoose.model('User' , userSchema);