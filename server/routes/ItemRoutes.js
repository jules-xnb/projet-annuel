const express = require('express')

const itemController = require('../controllers/ItemControllers')
const auth = require('../middleware/auth');
const router = express.Router()

router.post('/create', auth, itemController.createItem)
router.put('/update', auth, itemController.updateItem)
router.delete('/delete', auth, itemController.deleteItem)
router.get('/items', itemController.getItems)

module.exports = router

















