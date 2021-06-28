const mongoose = require('mongoose')
const uniqueValidator = require ('mongoose-unique-validator')

const itemSchema = new mongoose.Schema(
    {
        image: { type: 
            String, 
            required: true,
            unique: true
        },
        possAddress: { 
            type: String, 
            required: true
        },
        creatorAddress: { 
            type: String, 
            required: true
        },
        comment: { 
            type: String
        },
        createdTimestamp: { 
            type: Date, 
            default: Date.now
        },
    }
)
itemSchema.plugin(uniqueValidator)

module.exports = mongoose.model('item', itemSchema)