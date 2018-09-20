var express = require('express');
var router = express.Router();



module.exports = (app, route) => {
    return router
        .get('/', function(req, res, next) {
            res.render('index', { title: 'Web management tool' });
        })
};