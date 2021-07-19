const mongoose = require('mongoose')
const uniqueValidator = require ('mongoose-unique-validator')

const bidSchema = new mongoose.Schema(
    {
        idItem: {
            type: String, 
            required: true,
            unique: true
        },
        active: { 
            type: Boolean, 
            required: true,
            default: true 
        },
        dateEnd: { 
            type: Date, 
            required: true
        },
        actualPrice: { 
            type: Number, 
            required: true
        },
        bidderAddress: { 
            type: String, 
            required: true,
        },
        creatorAddress: { 
            type: String, 
            required: true,
        },
        
    }
)

bidSchema.plugin(uniqueValidator)

module.exports = mongoose.model('bid', bidSchema)



