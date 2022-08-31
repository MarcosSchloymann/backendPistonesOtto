var express = require('express');
// const res = require('express/lib/response');
// const async = require('hbs/lib/async');
var router = express.Router();
var productosModels = require('../../models/productosModels');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

/* GET home page. */
router.get('/', async function (req, res, next) {
  var productos = await productosModels.getProductos();

    productos = productos.map(producto => {
      if (producto.img_id) {
        const imagen = cloudinary.image(producto.img_id, {
          width: 50,
          height: 50,
          crop: 'fill'
        });
        return {
          ...producto,
          imagen
        }
      } else {
        return {
          ...producto,
          imagen: ''
        }
      }
    });

  res.render('admin/productos', {
    layout: 'admin/layout',
    productos
  });
});

router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  })
});


router.post('/agregar', async (req, res, next) => {
  try {
        let img_id = '';
        if (req.files && Object.keys(req.files).length > 0) {
          imagen = req.files.imagen;
          img_id = (await uploader(imagen.tempFilePath)).public_id;
        }
    if (req.body.titulo != "" && req.body.subtitulo != "") {
      await productosModels.insertProducto({
        ...req.body,
      img_id
    });
      res.redirect('/admin/productos')
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'no se cargó el producto'
    })
  }
})

router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;

  let producto = await productosModels.getProductoById(id);
  if(producto.img_id){
    await(destroy(producto.img_id));
  }

  await productosModels.deleteProductosById(id);
  res.redirect('/admin/productos');
})

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  console.log(req.params.id);
  var producto = await productosModels.getProductoById(id);
  res.render('admin/modificar', {
    layout: 'admin/layout',
    producto
  })
});

router.post('/modificar', async (req, res, next) => {
   try {
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }

    var obj = {
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      img_id
    }

    console.log(obj)

    await productosModels.modificarProductoById(obj, req.body.id);
    res.redirect('/admin/productos');
  } catch (error) {
    // console.log(error)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'no se modificó el producto'
    })
  }
})

module.exports = router;
