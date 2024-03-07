const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config);

exports.ver = async (req, res) => {
    try {
        const cliente = await db('cliente')
            .select('cliente.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel', 'cliente.cli_correo', 'empresa.emp_nomcom', 'tipocli.tip_nom', 'campana.cam_nom')
            .join('empresa', 'cliente.emp_clave', '=', 'empresa.emp_clave')
            .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
            .join('clixcam', 'cliente.cli_clave', '=', 'clixcam.cli_clave')
            .join('campana', 'clixcam.cam_clave', '=', 'campana.cam_clave');


        res.send({
            result: cliente
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

exports.agregar = async (req, res) => {
    try {
        const { emp_clave, tip_clave, cli_nomcom, cli_cel, cli_correo, cam_clave } = req.body;

        const [cli_clave] = await db('cliente').insert({
            emp_clave,
            tip_clave,
            cli_nomcom,
            cli_cel,
            cli_correo
        });

        const [cxc_fecha] = await db('clixcam').insert({
            emp_clave,
            cam_clave,
            cli_clave
        });

        const insertedRow = await db('cliente')
            .select('cliente.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel', 'cliente.cli_correo', 'empresa.emp_nomcom', 'tipocli.tip_nom', 'campana.cam_nom')
            .join('empresa', 'cliente.emp_clave', '=', 'empresa.emp_clave')
            .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
            .join('clixcam', 'cliente.cli_clave', '=', 'clixcam.cli_clave')
            .join('campana', 'clixcam.cam_clave', '=', 'campana.cam_clave')
            .where('cliente.cli_clave', cli_clave).first();

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
        const { cli_clave } = req.params;
        const { emp_clave, tip_clave, cli_nomcom, cli_cel, cli_correo, cam_clave } = req.body;

        const updatedRows = await db('cliente')
            .where('cli_clave', cli_clave)
            .update({
                emp_clave,
                tip_clave,
                cli_nomcom,
                cli_cel,
                cli_correo
            });

        const updatedRows2 = await db('clixcam')
            .where('cli_clave', cli_clave)
            .update({
                emp_clave,
                cam_clave,
                cli_clave,
                cxc_fecha,
                cxc_estatus
            });

        if (updatedRows > 0) {
            const updatedRow = await db('cliente')
                .select('cliente.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel', 'cliente.cli_correo', 'empresa.emp_nomcom', 'tipocli.tip_nom')
                .join('empresa', 'cliente.emp_clave', '=', 'empresa.emp_clave')
                .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
                .where('cliente.cli_clave', cli_clave).first();

            res.json({ result: updatedRow });
        } else {
            res.status(404).json({ msg: 'Cliente no encontrado o no se pudo actualizar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { cli_clave } = req.params;

        const deletedRows = await db('cliente')
            .where('cli_clave', cli_clave)
            .del();

        if (deletedRows > 0) {
            res.json({ msg: 'Cliente eliminado exitosamente' });
        } else {
            res.status(404).json({ msg: 'Cliente no encontrado o no se pudo eliminar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.select = async (req, res) => {
    try {
        const clienteselec = await db('cliente').select('cli_clave', 'cli_nomcom');

        res.send({
            result: clienteselec
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};

exports.selectXemp = async (req, res) => {
    try {
        const { empresa } = req.body
        const clienteselec = await db('cliente').select('cli_clave', 'cli_nomcom').where('emp_clave', empresa);

        res.send({
            result: clienteselec
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};

exports.empcli = async (req, res) => {
    try {
        const { empresa } = req.body
        const clienteBusqueda = await db('cliente')
            .select('cliente.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel', 'cliente.cli_correo', 'empresa.emp_nomcom', 'tipocli.tip_nom')
            .join('empresa', 'cliente.emp_clave', '=', 'empresa.emp_clave')
            .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
            .where('cliente.emp_clave', empresa);


        res.send({
            result: clienteBusqueda
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};

exports.busqedaxcel = async (req, res) => {
    try {
        const { cli_cel } = req.body;
        const buscel = await db('cliente').select('cli_clave','cli_nomcom').where('cli_cel', cli_cel);


        if (buscel.length > 0) {
            res.json({ result:buscel });
        } else {
            res.status(200).json({ result:buscel});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};

exports.conttipocli = async (req, res) => {
    try {
        const { empresa, tipocli } = req.body
        const contadortipocliente = await db('cliente')
            .count('emp_clave as contador')
            .where('emp_clave', empresa)
            .andWhere('tip_clave', tipocli);

        res.send({
            result: contadortipocliente
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};