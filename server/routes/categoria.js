const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');
const _ = require('underscore');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', (req, res) => {

    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;

    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, cantidad) => {
                res.json({
                    ok: true,
                    categorias,
                    cantidad
                });
            });
        });
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById(...Categoria...);
    //regresa solo id
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: _.pick(categoriaDB, ['descripcion', 'usuario'])
        });
    });
});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria/:id', verificaToken, (req, res) => {
    //regresa la nueva categoria
    // req.usuario._id
    let body = req.body;
    let usuarioId = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioId
    });
    console.log(categoria);

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// ============================
// Actualiza una categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //solo la descripción
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// ============================
// Borra una categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar categorias
    //Categoria.findByIdAndRemove()
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

module.exports = app;