const express = require('express')

const BidController = require('../controllers/BidControllers')
const auth = require('../middleware/auth');
const router = express.Router()

router.post('/create', auth, BidController.createBid)
router.put('/update', auth, BidController.updateBid)
router.delete('/delete', auth, BidController.deleteBid)
router.get('/bidsItem', BidController.getBidsByItem)
router.get('/bids', BidController.getBids)

module.exports = router