const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true,
    //     // unique: true
    // },
    phoneNumber: {
        type: [String],
        required: true,
    },
    address: {
        homeAddress: {
            type: String,
            required: true
        },
        localgvt: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    profession: {
        type: String
    },
    artisan: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean
    }
});

const updatedUser = mongoose.model("UpdatedUser", userSchema);

module.exports = updatedUser;