var express = require('express');
var router = express.Router();
const controller = require('../controller/recipeController')

router.get('/', controller.select)
router.get('/:RecipeId', controller.selectById)
router.post('/', controller.create)
router.put('/', controller.update)
router.delete('/:RecipeId', controller.deleteById)

module.exports = router;
