var express = require('express');
var router = express.Router();
const controller = require('../controller/loveController')


router.get('/:UserID/:RecipeId', controller.select)
router.get('/:UserID', controller.getFavourite)
router.post('/', controller.create)
router.delete('/:UserID/:RecipeId', controller.delete)
module.exports = router;
