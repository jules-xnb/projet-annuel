const express = require('express')

const BidController = require('../controllers/BidControllers')
const auth = require('../middleware/auth');
const router = express.Router()

router.post('/create', auth, BidController.createBid)
router.put('/update/:id', auth, BidController.updateBid)
router.delete('/delete/:id', auth, BidController.deleteBid)
router.get('/bid/:id', BidController.getBidById)
router.get('/bids', BidController.getBids)

module.exports = router