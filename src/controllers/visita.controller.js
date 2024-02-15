const knex = require('knex');
const config = require('../../knexfile');
const moment = require('moment');

const db = knex(config);

exports.ver = async (req, res) => {
    try {
        const visita = await db('visita')
            .select('visita.vis_fecha', 'usuario.usu_nombre', 'sucursal.suc_nom', 'cliente.cli_nomcom', 'campana.cam_nom')
            .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
            .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
            .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
            .join('campana', 'visita.vis_cam', '=', 'campana.cam_clave');

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

        const insertedRow = await db('visita')
            .select('visita.vis_fecha', 'usuario.usu_nombre', 'sucursal.suc_nom', 'cliente.cli_nomcom', 'campana.cam_nom')
            .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
            .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
            .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
            .join('campana', 'visita.vis_cam', '=', 'campana.cam_clave')
            .where('visita.vis_fecha', db.fn.now()).first();

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
        const { usu_numctrl, suc_clave, cli_clave, vis_fecha, vis_cam } = req.body;

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
            const updatedRow = await db('visita')
                .select('visita.vis_fecha', 'usuario.usu_nombre', 'sucursal.suc_nom', 'cliente.cli_nomcom', 'campana.cam_nom')
                .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                .join('campana', 'visita.vis_cam', '=', 'campana.cam_clave')
                .where('visita.vis_fecha', vis_fecha).first();


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

exports.insercionmulti = async (req, res) => {
    try {
        const { emp_clave, tip_clave, cli_nomcom, cli_cel, cli_correo, cam_clave, cxc_estatus, usu_numctrl, suc_clave } = req.body;

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
            cli_clave,
        });


        const [visfecha] = await db('visita').insert({
            usu_numctrl,
            suc_clave,
            cli_clave,
            vis_cam: cam_clave
        });

        res.status(200).json({ msg: 'Inserciones realizadas' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.ExpRep = async (req, res) => {
    try {
        const { empresa, nuevo, inicio, fin } = req.body;

        if (nuevo == 0) {
            const RepoertExpNN = await db('visita')
                .select('usuario.emp_clave', 'empresa.emp_nomcom', 'visita.vis_fecha', 'visita.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel')
                .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                .where('usuario.emp_clave', empresa)
                .whereBetween('visita.vis_fecha', [inicio, fin]);

            res.status(200).json({ result: RepoertExpNN });

        }
        else {

            // const Consulta1 = await db('visita')
            //     .select('usuario.emp_clave', 'empresa.emp_nomcom', 'visita.vis_fecha', 'visita.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel').count('visita.cli_clave')
            //     .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
            //     .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
            //     .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
            //     .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
            //     .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
            //     .where('usuario.emp_clave', empresa)
            //     .whereBetween('visita.vis_fecha', [inicio, fin])
            //     .groupBy('visita.cli_clave', 'usuario.emp_clave');

            const ConsultaR = await db
                .select('emp_clave','emp_nomcom','vis_fecha','cli_clave','cli_nomcom','cli_cel')
                .from(function () {
                    this.select('usuario.emp_clave', 'empresa.emp_nomcom', 'visita.vis_fecha', 'visita.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel').count('visita.cli_clave as contador')
                        .from('visita')
                        .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                        .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                        .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                        .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                        .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                        .where('usuario.emp_clave', empresa)
                        .whereBetween('visita.vis_fecha', ['2020-01-01', fin])
                        .groupBy('visita.cli_clave', 'usuario.emp_clave')
                        .as('subquery');
                })
                .whereBetween('vis_fecha', [inicio, fin])
                .where('contador',1)


            res.status(200).json({ result: ConsultaR });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
