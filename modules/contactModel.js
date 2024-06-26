const mongoose = require('mongoose');

const contactModelField = mongoose.Schema(
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
            trim: true
        },
        mobile: {
            type: Number,
            required: true
        },
        discription: {
            type: String,
            required: true
        }
    },
    { timestamps: true },
    { versionKey: false }
);
module.exports = mongoose.model('contacts', contactModelField);