const knex = require('knex');
const config = require('../../knexfile');
const moment = require('moment');

const db = knex(config);


exports.ver = async (req, res) => {
    try {
        const visita = await db('visita').select('*');

        res.send({
            result: visita
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

exports.agregar = async (req, res) => {
    try {
        const { usu_numctrl, suc_clave, cli_clave, vis_cam } = req.body;

        const [visfecha] = await db('visita').insert({
            usu_numctrl,
            suc_clave,
            cli_clave,
            vis_cam
        });

        const insertedRow = await db('visita').where('vis_fecha', db.fn.now()).first();

        res.send({
            result: insertedRow
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error de servidor' });
    }
};


exports.editar = async (req, res) => {
    try {
        const { visfecha } = req.params;
        const { usu_numctrl, suc_clave, cli_clave, vis_fecha,vis_cam } = req.body;

        

        console.log(visfecha)
        const updatedRows = await db('visita')
            .where('vis_fecha', visfecha)
            .update({
                usu_numctrl,
                suc_clave,
                cli_clave,
                vis_fecha,
                vis_cam
            });

        if (updatedRows > 0) {
            const updatedRow = await db('visita').where('vis_fecha', vis_fecha).first();
            res.json({ result: updatedRow });
        } else {
            res.status(404).json({ msg: 'Visita no encontrada o no se pudo actualizar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { vis_fecha } = req.params;

        const deletedRows = await db('visita')
            .where('vis_fecha', vis_fecha)
            .del();

        if (deletedRows > 0) {
            res.json({ msg: 'Visita eliminada exitosamente' });
        } else {
            res.status(404).json({ msg: 'Visita no encontrada o no se pudo eliminar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
