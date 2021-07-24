const Item = require('../models/ItemModels')
const mongoose = require('mongoose')

createItem = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a item',
        })
    }

    const item = new Item({
        image: body.image, 
        possAddress: body.address,
        creatorAddress: body.address,
        comment: body.comment
    })

    if (!item) {
        return res.status(400).json({ success: false, error: err })
    }

    item
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: item._id,
                message: 'Item created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Item not created!',
            })
        })
}

updateItem = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Item.findOne({ _id: body.id }, (err, item) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Item not found!',
            })
        }
        item.possAddress = body.address
        item
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: item._id,
                    message: 'Item updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Item not updated!',
                })
            })
    })
}

deleteItem = (req, res) => {
    Item.findOneAndDelete({ _id: req.body.id }, (err, item) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!item) {
            return res
                .status(404)
                .json({ success: false, error: `Item not found` })
        }

        return res.status(200).json({ success: true, data: item })
    }).catch(err => console.log(err))
}


getItems = (req, res) => {
    Item.find({ possAddress : req.body.address }, (err, items) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!items.length) {
            return res
                .status(404)
                .json({ success: false, error: `Item not found` })
        }
        return res.status(200).json({ success: true, data: items })
    }).catch(err => console.log(err))
}

module.exports = {
    createItem,
    updateItem,
    deleteItem,
    getItems
}