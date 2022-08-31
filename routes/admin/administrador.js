var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var usuariosModels = require('./../../models/usuariosModels');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin/administrador', {
    layout: 'admin/layout',
    persona: req.session.nombre
  });
});

module.exports = router;