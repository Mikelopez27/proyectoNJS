const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config);

exports.ver = async (req, res) => {
    try {
        const tipocli = await db('tipocli').select('*');

        res.send({
            result: tipocli
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

exports.agregar = async (req, res) => {
    try {
        const { tip_clave, emp_clave, tip_nom, tip_desc } = req.body;

        const [tipclave] = await db('tipocli').insert({
            tip_clave,
            emp_clave,
            tip_nom,
            tip_desc
        });

        const insertedRow = await db('tipocli').where('tip_clave', tip_clave).first();

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
        const { tip_clave } = req.params;
        const { emp_clave, tip_nom, tip_desc } = req.body;

        const updatedRows = await db('tipocli')
            .where('tip_clave', tip_clave)
            .update({
                emp_clave,
                tip_nom,
                tip_desc
            });

        if (updatedRows > 0) {
            const updatedRow = await db('tipocli').where('tip_clave', tip_clave).first();
            res.json({ result: updatedRow });
        } else {
            res.status(404).json({ msg: 'Tipo cliente no encontrado o no se pudo actualizar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { tip_clave } = req.params;

        const deletedRows = await db('tipocli')
            .where('tip_clave', tip_clave)
            .del();

        if (deletedRows > 0) {
            res.json({ msg: 'Tipo cliente eliminado exitosamente' });
        } else {
            res.status(404).json({ msg: 'Tipo cliente no encontrado o no se pudo eliminar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.select = async (req, res) => {
    try {
        const tipocliselec = await db('tipocli').select('tip_clave', 'tip_nom');

        res.send({
            result: tipocliselec
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};