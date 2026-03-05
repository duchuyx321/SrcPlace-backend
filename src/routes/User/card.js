const express = require('express');

const router = express.Router();

const CardController = require('../../app/Controller/User/CardController');

// [GET]
router.get('/', CardController.getCards);
// [POST]
router.post('/add', CardController.addCards);
// [PATCH]

// [DELETE]
router.delete('/delete', CardController.deletedCards);
router.delete('/destroy', CardController.destroyCards);

module.exports = router;
