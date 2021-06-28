const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require ('mongoose-unique-validator')

const itemSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        active: { 
            type: Boolean, 
            required: true
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
            required: true
        },
        
    },
    { timestamps: true },
)

itemSchema.plugin(uniqueValidator)

module.exports = mongoose.model('item', itemSchema)