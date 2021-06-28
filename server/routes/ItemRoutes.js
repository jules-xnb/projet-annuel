const express = require('express')

const itemController = require('../controllers/ItemControllers')
const auth = require('../middleware/auth');
const router = express.Router()

router.post('/create', auth, itemController.createItem)
router.put('/updateupdate/:id', auth, itemController.updateItem)
router.delete('/delete/:id', auth, itemController.deleteItem)
router.get('/item/:id', itemController.getItemById)
router.get('/items', itemController.getItems)

module.exports = router