const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config);

exports.ver = async (req, res) => {
    try {
        const sucursal = await db('sucursal').select('*');

        res.send({
            result: sucursal
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

exports.agregar = async (req, res) => {
    try {
        const { emp_clave, suc_nom, suc_tel, suc_conta, suc_cel, suc_calle, suc_col } = req.body;

        const [suc_clave] = await db('sucursal').insert({
            emp_clave,
            suc_nom,
            suc_tel,
            suc_conta,
            suc_cel,
            suc_calle,
            suc_col
        });

        const insertedRow = await db('sucursal').where('suc_clave', suc_clave).first();

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
        const { suc_clave } = req.params;
        const { emp_clave, suc_nom, suc_tel, suc_conta, suc_cel, suc_calle, suc_col } = req.body;

        const updatedRows = await db('sucursal')
            .where('suc_clave', suc_clave)
            .update({
                emp_clave,
                suc_nom,
                suc_tel,
                suc_conta,
                suc_cel,
                suc_calle,
                suc_col
            });

        if (updatedRows > 0) {
            const updatedRow = await db('sucursal').where('suc_clave', suc_clave).first();
            res.json({ result: updatedRow });
        } else {
            res.status(404).json({ msg: 'Sucursal no encontrada o no se pudo actualizar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { suc_clave } = req.params;

        const deletedRows = await db('sucursal')
            .where('suc_clave', suc_clave)
            .del();

        if (deletedRows > 0) {
            res.json({ msg: 'Sucursal eliminada exitosamente' });
        } else {
            res.status(404).json({ msg: 'Sucursal no encontrada o no se pudo eliminar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.select = async (req, res) => {
    try {
        const sucursalselec = await db('sucursal').select('suc_clave', 'suc_nom');

        res.send({
            result: sucursalselec
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};