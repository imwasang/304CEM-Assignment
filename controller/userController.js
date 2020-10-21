var db = require('../db');
var app = require('express')();
module.exports = {
    login: function (req, res) {
        db.getAllByFilter('user', req.fields, function (err, data) {
            if (err || data.length == 0) {
                res.status(500).send({
                    code: 0,
                    message: 'Wrong user name or password'
                })
            } else {
                let message = {
                    code: 1
                }
                app.locals.session = data[0]
                res.send(Object.assign(message, data[0]))
            }
        })
    },
    register: function (req, res) {
        db.getAllByFilter('user', { username: req.fields.username }, function (err, data) {
            if (data.length > 0) {
                res.send({
                    code: 0,
                    message: 'The user name already exists'
                })
            } else {
                // 如果没有就添加用户
                db.add('user', req.fields, function (err, data) {
                    if (err) {
                        res.send({
                            code: 0,
                            message: 'Register error: ' + err
                        })
                    } else {
                        let msg = {
                            code: 1
                        }
                        res.status(201).send(Object.assign(msg, data[0]))
                    }
                })
            }
        })
    },
    validate: function (req, res) {
        // app.locals.session 如果nodejs重启就没有了, 需要重新登录
        if (app.locals.session) {
            let data = {
                code: 1
            }
            // assign合并对象一起返回
            res.send(Object.assign(data, app.locals.session))
        } else {
            res.send({
                code: 0
            })
        }
    },
    logout: function (req, res) {
        delete app.locals.session
        res.send({
            code: 1
        })
    }
}