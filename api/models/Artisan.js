const mongoose = require("mongoose");

const artisanSchema = new mongoose.Schema({
    isArtisan: {
        type: Boolean
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: [String],
        required: true,
    },
    profileImg: {
        type: String
    }, 
    profession:{
        type: String,
        required: true
    },
    shortMsg: {
        type: String
    },
    rating: {
        type: Number
    },
    imgOfWork: [String]
})