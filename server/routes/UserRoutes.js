const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/UserControllers');
const auth = require('../middleware/auth');

router.get('/users', userCtrl.getAll);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
//router.delete('/delete', auth, userCtrl.delete);

module.exports = router;










