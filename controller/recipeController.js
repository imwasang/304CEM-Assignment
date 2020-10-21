var db = require('../db');
var fs = require('fs');
var path = require('path');
module.exports = {
    deleteById: function (req, res) {
        db.remove('recipe', req.params, function (err) {
            if (err) {
                res.send({
                    code: 0,
                    error: err
                })
            } else {
                fs.unlink(path.join('public', req.fields.RecipePicture), function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
                res.send({
                    code: 1
                })
            }
        })

    },
    selectById: function (req, res) {
        db.getOneById('recipe', [
            Object.keys(req.params)[0],
            Object.values(req.params)[0],
        ], function (err, data) {
            if (err) {
                res.send({
                    code: 0,
                    error: err
                })
            } else {
                res.send(
                    Object.assign({
                        code: 1,
                    }, data[0])
                )
            }
        })
    },
    select: function (req, res) {
        db.getAll('recipe', [
            'RecipeId', 'RecipeName', 'RecipePicture',
            'RecipeTime', 'RecipeCategory'
        ], function (err, data) {
            if (err) {
                res.send({
                    code: 0,
                    error: err
                })
            } else {
                res.send({
                    code: 1,
                    list: data
                })
            }
        })
    },
    create: function (req, res) {
        var newFilePath = path.join('public', 'images', req.files.RecipePicture.name)

        fs.copyFile(req.files.RecipePicture.path, newFilePath, function (err) {
            if (err) {
                console.log(err);
            } else {
                req.fields.RecipePicture = '/images/' + req.files.RecipePicture.name
                db.add('recipe', req.fields, function (err) {
                    if (err) {
                        res.send({ code: 0, error: err })
                    } else {
                        res.status(201).send({ code: 1 })
                    }
                })
            }
        })
    },
    update: function (req, res) {
        let files = Object.assign({}, req.files)
        let fields = Object.assign({}, req.fields)
        if (files.RecipePicture) {
            fs.unlink(path.join('public', req.fields.oldRecipePicture), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    delete fields.oldRecipePicture
                    var newFilePath = path.join('public', 'images', files.RecipePicture.name)
                    fs.copyFile(files.RecipePicture.path, newFilePath, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            fields.RecipePicture = '/images/' + files.RecipePicture.name
                            db.update('recipe', fields, {
                                RecipeId: fields.RecipeId
                            }, function (err) {
                                if (err) {
                                    res.send({ code: 0, error: err })
                                } else {
                                    res.send({ code: 1 })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            delete fields.oldRecipePicture
            db.update('recipe', fields, {
                RecipeId: fields.RecipeId
            }, function (err) {
                if (err) {
                    res.send({ code: 0, error: err })
                } else {
                    res.send({ code: 1 })
                }
            })
        }
    }
}