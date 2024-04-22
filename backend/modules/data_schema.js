const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
        
    },
    budget: {
        type: Number,
        trim: true,
        required: true
    },
    color: {
        type: String,
        required: true
    }

}, {collection : 'pBudget'})

module.exports = mongoose.model('pBudget', dataSchema)