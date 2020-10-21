var express = require('express');
var path = require('path');
var userRouter = require('./routes/user');
var recipeRouter = require('./routes/recipe');
var loveRouter = require('./routes/love');
var formidableMiddleware = require('express-formidable');
var app = express();



app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(formidableMiddleware());
app.use('/api/user', userRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/love', loveRouter);
app.listen(3000, () => {
    console.log('http://localhost:3000');
})
