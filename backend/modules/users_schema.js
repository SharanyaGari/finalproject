const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
        
    },
    createpassword: {
        type: String,
        trim: true,
        required: true
    }
}, {collection : 'pbUsers'})

module.exports = mongoose.model('pbUsers', usersSchema)