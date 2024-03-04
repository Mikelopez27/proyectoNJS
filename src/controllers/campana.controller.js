const knex = require('knex');
const config = require('../../knexfile');
const fs = require('fs');
const path = require('path');

const db = knex(config);

exports.ver = async (req, res) => {
    try {
        const campana = await db('campana')
            .select('campana.cam_clave', 'campana.cam_nom', 'campana.cam_desc', 'campana.cam_lanza', 'empresa.emp_nomcom', 'tipocli.tip_nom')
            .join('empresa', 'campana.emp_clave', '=', 'empresa.emp_clave')
            .join('tipocli', 'campana.tip_clave', '=', 'tipocli.tip_clave');

        res.send({
            result: campana
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

exports.agregar = async (req, res) => {
    try {
        let data;

        if (req.file == null) {
            data = fs.readFileSync(path.join(__dirname, '../../images/' + 'company.png'));
        }
        else {
            const type = req.file.mimetype;
            const name = req.file.originalname;
            data = fs.readFileSync(path.join(__dirname, '../../images/' + req.file.filename));
        }

        const { emp_clave, tip_clave, cam_nom, cam_desc, cam_lanza, cam_mensaje, cam_crea } = req.body;

        const [cam_clave] = await db('campana').insert({
            emp_clave,
            tip_clave,
            cam_nom,
            cam_desc,
            cam_lanza,
            cam_mensaje,
            cam_imagen: data,
            cam_crea

        });

        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../../images/' + req.file.filename));
        }

        const insertedRow = await db('campana')
            .select('campana.cam_clave', 'campana.cam_nom', 'campana.cam_desc', 'campana.cam_lanza', 'empresa.emp_nomcom', 'tipocli.tip_nom')
            .join('empresa', 'campana.emp_clave', '=', 'empresa.emp_clave')
            .join('tipocli', 'campana.tip_clave', '=', 'tipocli.tip_clave')
            .where('campana.cam_clave', cam_clave).first();

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

        let data;

        if (req.file == null) {
            data = fs.readFileSync(path.join(__dirname, '../../images/' + 'company.png'));
        }
        else {
            const type = req.file.mimetype;
            const name = req.file.originalname;
            data = fs.readFileSync(path.join(__dirname, '../../images/' + req.file.filename));
        }

        const { cam_clave } = req.params;
        
        const { emp_clave, tip_clave, cam_nom, cam_desc, cam_lanza, cam_mensaje, cam_crea } = req.body;

        const updatedRows = await db('campana')
            .where('cam_clave', cam_clave)
            .update({
                emp_clave,
                tip_clave,
                cam_nom,
                cam_desc,
                cam_lanza,
                cam_mensaje,
                cam_imagen: data,
                cam_crea
            });

        if (updatedRows > 0) {
            const updatedRow = await db('campana')
                .select('campana.cam_clave', 'campana.cam_nom', 'campana.cam_desc', 'campana.cam_lanza', 'empresa.emp_nomcom', 'tipocli.tip_nom')
                .join('empresa', 'campana.emp_clave', '=', 'empresa.emp_clave')
                .join('tipocli', 'campana.tip_clave', '=', 'tipocli.tip_clave')
                .where('campana.cam_clave', cam_clave).first();

            res.json({ result: updatedRow });
        } else {
            res.status(404).json({ msg: 'Campaña no encontrada o no se pudo actualizar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { cam_clave } = req.params;

        const deletedRows = await db('campana')
            .where('cam_clave', cam_clave)
            .del();

        if (deletedRows > 0) {
            res.json({ msg: 'Campaña eliminada exitosamente' });
        } else {
            res.status(404).json({ msg: 'Campaña no encontrada o no se pudo eliminar' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.select = async (req, res) => {
    try {
        const campanaselec = await db('campana').select('cam_clave', 'cam_nom');

        res.send({
            result: campanaselec
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};

exports.selectXemp = async (req, res) => {
    try {
        const { empresa } = req.body
        const campanaselec = await db('campana').select('cam_clave', 'cam_nom').where('emp_clave', empresa);

        res.send({
            result: campanaselec
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};

exports.empcam = async (req, res) => {
    try {
        const { empresa } = req.body
        const campanaBusqueda = await db('campana')
            .select('campana.cam_clave', 'campana.cam_nom', 'campana.cam_desc', 'campana.cam_lanza', 'empresa.emp_nomcom', 'tipocli.tip_nom')
            .join('empresa', 'campana.emp_clave', '=', 'empresa.emp_clave')
            .join('tipocli', 'campana.tip_clave', '=', 'tipocli.tip_clave')
            .where('campana.emp_clave', empresa);



        res.send({
            result: campanaBusqueda
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }

};