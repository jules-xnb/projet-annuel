const mongoose = require('mongoose')
const uniqueValidator = require ('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    address:{
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    actualBalance: { 
        type: Number, 
        required: true
    },
    totalBalance: { 
        type: Number, 
        required: true
    }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user', userSchema) 













