const express = require('express');
let { verificaToken } = require('../middlewares/authentication');
const _ = require('underscore');

let app = express();

let Producto = require('../models/producto');

// ============================
// Mostrar todos los productos
// ============================
app.get('/productos', (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;

    Producto.find({}, 'disponible nombre precioUni descripcion categoria usuario')
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, cantidad) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad
                });
            });
        });
});

// ============================
// Obtener un producto por ID
// ============================
app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;
    Producto.findById(id, 'disponible nombre precioUni descripcion categoria usuario')
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, cantidad) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad
                });
            });
        });
});

// ============================
// Buscar Productos
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })

})



// ============================
// Crear un nuevo producto
// ============================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let usuarioId = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
        usuario: usuarioId
    });
    console.log(producto);

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ============================
// Actualizar un producto
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

// ============================
// Borrar un producto
// ============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria
    // disponible false
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoNoDisponible) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoNoDisponible) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoNoDisponible
        });
    });
});

module.exports = app;