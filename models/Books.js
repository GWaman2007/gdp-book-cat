const mongoose = require("mongoose");
const { type } = require("node:os");

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },    
    year: {
        type: String,
        required: true,
    },
});

module.exports=mongoose.model("Books", booksSchema);