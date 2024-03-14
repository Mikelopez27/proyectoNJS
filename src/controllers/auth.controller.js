
const knex = require('knex');
const config = require('../../knexfile');
const jwt = require('jsonwebtoken');
const { blacklist } = require("../middleware.js")

const db = knex(config);

exports.autenticacion = async (req, res) => {
    try {
        const { correo, contrasena } = req.body

        const autenticar = await db('usuario')
            .where('usu_correo', correo)
            .where('usu_contra', contrasena)
            .first();

        if (autenticar) {
            const token = jwt.sign({ correo }, "Stack", {
                expiresIn: '480m'
            });
            if (blacklist.has(token)) {
                res.status(401).json({ token: '', status: 500 });
            } else {
                const nombreEmpresa = await db('empresa').select('emp_nomcom').where('emp_clave', autenticar.emp_clave).first()

                res.send({ token, status: 200, rol: autenticar.usu_tipo, clave:autenticar.usu_numctrl ,nombre: autenticar.usu_nombre, empresa: autenticar.emp_clave, nomemp:nombreEmpresa.emp_nomcom })
            }
            
        }
        else {
            res.send({ token: "", status: 403 });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }

};

exports.logout = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        blacklist.add(token)

        res.status(200).json('Logout exitoso');
    } catch (error) {
        console.error(error);
        res.status(500).json('Error en el servidor');
    }
};



