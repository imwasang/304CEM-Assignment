var db = require('../db');
module.exports = {
    create: function (req, res) {
        db.add('love', req.fields, function (err) {
            if (err) {
                res.status(500).send({
                    code: 0,
                    error: err
                })
            } else {
                res.status(201).send({
                    code: 1
                })
            }
        })
    },
    select: function (req, res) {
        req.params
        db.getAllByFilter('love', req.params, function (err, data) {
            if (err) {
                res.send(Object.assign({
                    code: 0,
                    error: err
                }))
            } else {
                res.send({
                    code: data.length > 0 ? 1 : 0
                })
            }
        })
    },
    getFavourite: function (req, res) {
        db.getFavourite(req.params.UserID, function (err, data) {
            if (err) {
                res.send(Object.assign({
                    code: 0,
                    error: err
                }))
            } else {
                res.send({
                    code: data.length > 0 ? 1 : 0,
                    list: data
                })
            }
        })
    },
    delete: function (req, res) {
        db.remove('love', req.params, function (err, data) {
            if (err) {
                res.send({
                    code: 0,
                    error: err
                })
            } else {
                res.send({ code: 1 })
            }
        })
    }
}