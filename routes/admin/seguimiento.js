var express = require('express');
const async = require('hbs/lib/async');
// const res = require('express/lib/response');
// const async = require('hbs/lib/async');
var router = express.Router();
var seguimientoModels = require('../../models/seguimientoModels');
// var util = require('util');
// var cloudinary = require('cloudinary').v2;
// const uploader = util.promisify(cloudinary.uploader.upload);
// const destroy = util.promisify(cloudinary.uploader.destroy);

/* GET home page. */
router.get('/', async function (req, res, next) {
  var seguimientos = await seguimientoModels.getSeguimientos();
  res.render('admin/seguimiento', {
    layout: 'admin/layout',
    seguimientos
  });
});

router.get('/agregar_seguimiento', (req, res, next) => {
  res.render('admin/agregar_seguimiento', {
    layout: 'admin/layout'
  })
});


router.post('/agregar_seguimiento', async (req, res, next) => {
  try {
    if (req.body.numero != "" && req.body.estado != "") {
      await seguimientoModels.insertSeguimiento(req.body);
      res.redirect('/admin/seguimiento')
    } else {
      res.render('admin/agregar_seguimiento', {
        layout: 'admin/layout',
        error: true,
        message: 'todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregar_seguimiento', {
      layout: 'admin/layout',
      error: true,
      message: 'no se cargó el seguimiento'
    })
  }
});

router.get('/eliminar_seguimiento/:id', async (req, res, next) => {
  var id = req.params.id;

  let seguimiento = await seguimientoModels.getSeguimientoById(id);
  await seguimientoModels.deleteSeguimientosById(id);
  res.redirect('/admin/seguimiento');
})

router.get('/modificar_seguimiento/:id', async (req, res, next) => {
  var id = req.params.id;
  console.log(req.params.id);
  var seguimiento = await seguimientoModels.getSeguimientoById(id);
  res.render('admin/modificar_seguimiento', {
    layout: 'admin/layout',
    seguimiento
  })
});

router.post('/modificar_seguimiento', async (req, res, next) => {
   try {

    var obj = {
      numero: req.body.numero,
      estado: req.body.estado,
    }

    console.log(obj)

    await seguimientoModels.modificarSeguimientoById(obj, req.body.id);
    res.redirect('/admin/seguimiento');
  } catch (error) {
    console.log(error)
    res.render('admin/modificar_seguimiento', {
      layout: 'admin/layout',
      error: true,
      message: 'no se modificó el pedido'
    })
  }
})


module.exports = router;