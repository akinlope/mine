const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        // required: true
    },
    // email: {
    //     type: String,
    //     required: true,
    //     // unique: true
    // },
    phoneNumber: {
        type: [String],
        // required: true,
    },
    address: {
        homeAddress: {
            type: String,
            // required: true
        },
        city: {
            type: String
        },
        localgvt: {
            type: String,
            // required: true
        },
        state: {
            type: String,
            // required: true
        }
    },
    bio: {
        type: String
    },
    profession: {
        type: String
    },
    artisan: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean
    },
    image: {
        type: String, 
        default: ""
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;