const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bidSchema = new Schema(
    {
        image: { type: 
            String, 
            required: true
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
            default: Date.now, 
            required: true
        },

    },
    { timestamps: true },
)

module.exports = mongoose.model('bid', bidSchema)



