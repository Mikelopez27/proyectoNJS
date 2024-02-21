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
        const { emp_clave, tip_clave, cli_nomcom, cli_cel, cli_correo, cam_clave, usu_numctrl, suc_clave } = req.body;

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
        const { empresa, tipo, nuevo, inicio, fin } = req.body;

        if (nuevo == 0) {
            let ReportExpNN = db('visita')
                .select('usuario.emp_clave', 'empresa.emp_nomcom', 'tipocli.tip_clave', 'tipocli.tip_nom', 'visita.vis_fecha', 'visita.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel')
                .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
                .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                .where('usuario.emp_clave', empresa)
                .whereBetween('visita.vis_fecha', [inicio, fin]);

            if (tipo != 0) {
                ReportExpNN = ReportExpNN.andWhere('cliente.tip_clave', tipo);
            }

            const Reporte = await ReportExpNN;

            res.status(200).json({ result: Reporte });

        }
        else {

            let ConsultaR = await db
                .select('*')
                .from(function () {
                    const subquery = this.select('usuario.emp_clave', 'empresa.emp_nomcom', 'tipocli.tip_clave', 'tipocli.tip_nom', 'visita.vis_fecha', 'visita.cli_clave', 'cliente.cli_nomcom', 'cliente.cli_cel')
                        .from('visita')
                        .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                        .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                        .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                        .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                        .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
                        .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                        .where('usuario.emp_clave', empresa)
                        .whereBetween('visita.vis_fecha', ['2020-01-01', fin])
                        .groupBy('visita.cli_clave', 'usuario.emp_clave')
                        .havingRaw('COUNT(visita.cli_clave) = 1');

                    if (tipo != 0) {
                        subquery.andWhere('cliente.tip_clave', tipo);
                    }

                    return subquery.as('subquery');
                })
                .whereBetween('vis_fecha', [inicio, fin]);

            const Reporte2 = await ConsultaR;

            res.status(200).json({ result: Reporte2 });

        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};


exports.ReporteUsu = async (req, res) => {
    try {
        const { empresa, tipo, usuario, nuevo, inicio, fin } = req.body;


        if (nuevo == 0) {
            let ReportUsu1 = db('visita')
                .select('visita.vis_fecha', 'cliente.cli_nomcom', 'cliente.cli_cel', 'tipocli.tip_nom')
                .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
                .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                .where('cliente.emp_clave', empresa)
                .whereBetween('visita.vis_fecha', [inicio, fin]);

            if ((usuario == 0) && (tipo == 0)) {
                const reporte1 = await ReportUsu1
                res.status(200).json({ result: reporte1 });
            }
            else if (usuario == 0 && tipo > 0) {
                const reporte1 = await ReportUsu1;

                const reporte2 = await ReportUsu1.count('visita.usu_numctrl as visitas');
                
                res.status(200).json({ result: reporte1, contador: reporte2 });
            }
            else if (usuario > 0 && tipo == 0) {
                // Código para el caso cuando usuario es mayor que cero y tipo es cero
            }
            else if (usuario > 0 && tipo > 0) {
                // Código para el caso cuando usuario y tipo son mayores que cero
            }

        }
        else {

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
