var express = require('express');
const async = require('hbs/lib/async');
const { getMaxListeners } = require('../models/bd');
var router = express.Router();
var productosModels = require('./../models/productosModels');
var seguimientoModels = require('./../models/seguimientoModels')
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

router.get('/productos', async function (req, res, next) {
    let productos = await productosModels.getProductos();

    productos = productos.map(productos => {
        if (productos.img_id) {
            const imagen = cloudinary.url(productos.img_id, {
                width: 800,
                height: 800,
                crop: 'crop'
            });
            return {
                ...productos,
                imagen
            }
        } else {
            return {
                ...productos,
                imagen: ''
            }
        }
    });
    res.json(productos);
});

router.get('/seguimiento', async function (req, res, next) {
    let seguimientos = await seguimientoModels.getSeguimientos();

    seguimientos = seguimientos.map(seguimientos => {

        return {
            ...seguimientos
        }
    }
    );
    res.json(seguimientos);
});

router.post('/contacto', async (req, res) => {
    const mail = {
        to: 'marcosschloymann@gmail.com',
        subject: 'Contacto Web',
        html: `${req.body.nombre} se contactó a traves de la web
         y quiere más información a este correo ${req.body.mail} 
         <br>además, hizo el siguiente comentario: ${req.body.mensaje}</br>`
    }

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transport.sendMail(mail)
    res.status(201).json({
        error: false,
        message: 'Mensaje enviado'
    });
});

module.exports = router;