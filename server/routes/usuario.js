const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication')

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                });
            });
        })
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    console.log(body);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    console.log(usuario);

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    //const { nombre, email, img, role, estado } = req.body;
    //let body = {nombre, email, img, role, estado};
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioInhabilitado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioInhabilitado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioInhabilitado
        });
    });
});

module.exports = app;