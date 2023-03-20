const mongoose = require('mongoose');
// const uuid = require("uuid")

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    desc: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});


module.exports = mongoose.model ('books', booksSchema);