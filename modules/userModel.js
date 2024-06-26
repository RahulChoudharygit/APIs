const mongoose = require('mongoose');

const userModelField = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ""
        },
        mobile: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin", "vendor"],
            default: "user"
        },
        masterpassword: {
            type: String,
            default: null
        }
    },
    { timestamps: true },
    { versionKey: false }
);

module.exports = mongoose.model('users', userModelField);