const mongoose = require("mongoose");

const tokensSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
        
    },
    refreshToken: {
        type: String,
        required: true
    },
    expirationTime: {
        type: Number,
        required: true
    }
}, {collection : 'tokens'})

module.exports = mongoose.model('tokens', tokensSchema)