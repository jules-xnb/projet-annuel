const Bid = require('../models/BidModels')

createBid = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a bid',
        })
    }

    const bid = new Bid({
        idItem: body.idItem, 
        dateEnd: body.dateEnd, 
        actualPrice: body.actualPrice, 
        bidderAddress: "pas encore d'acheteur",
        creatorAddress: body.creatorAddress
    })

    if (!bid) {
        return res.status(400).json({ success: false, error: err })
    }

    bid
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: bid._id,
                message: 'Bid created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Bid not created!',
            })
        })
}

updateBid = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Bid.findOne({ _id: req.body.id }, (err, bid) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Bid not found!',
            })
        }
        bid.active = body.active
        bid.actualPrice = body.actualPrice, 
        bid.bidderAddress = body.bidderAddress
        bid
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: bid._id,
                    message: 'Bid updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Bid not updated!',
                })
            })
    })
}

deleteBid = async (req, res) => {
    await Bid.findOneAndDelete({ _id: req.body.id }, (err, bid) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!bid) {
            return res
                .status(404)
                .json({ success: false, error: `Bid not found` })
        }

        return res.status(200).json({ success: true, data: bid })
    }).catch(err => console.log(err))
}

getBidsByItem = async (req, res) => {
    await Bid.find({ idItem : req.body.id }, (err, bids) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!bids.length) {
            return res
                .status(201)
                .json({ success: false, error: `Bid not found` })
        }
        return res.status(200).json({ success: true, data: bids })
    }).catch(err => console.log(err))
}

getBids = async (req, res) => {
    await Bid.find({}, (err, bids) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!bids.length) {
            return res
                .status(401)
                .json({ success: false, error: `Bid not found` })
        }
        return res.status(200).json({ success: true, data: bids })
    }).catch(err => console.log(err))
}

module.exports = {
    createBid,
    updateBid,
    deleteBid,
    getBidsByItem, 
    getBids
}
