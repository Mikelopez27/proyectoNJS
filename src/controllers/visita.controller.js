const knex = require('knex');
const config = require('../../knexfile');
const moment = require('moment');
const { json } = require('express');

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

            let ReportUsu2 = db('visita')
                .select('usuario.usu_nombre').count('visita.usu_numctrl as visitas')
                .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
                .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                .where('cliente.emp_clave', empresa)
                .whereBetween('visita.vis_fecha', [inicio, fin])
                .groupBy('usuario.usu_nombre');


            // todos - todos = r2
            if ((usuario == 0) && (tipo == 0)) {
                const reporte1 = await ReportUsu2
                const reporte2 = reporte1.reduce((total, item) => total + item.visitas, 0);
                res.status(200).json({ result: reporte1, contador: reporte2 });
            }
            // todos - eleccion r1
            else if (usuario == 0 && tipo > 0) {
                ReportUsu1 = ReportUsu1.andWhere('tipocli.tip_clave', tipo)
                const reporte1 = await ReportUsu1;
                const reporte2 = reporte1.length;

                res.status(200).json({ result: reporte1, contador: reporte2 });
            }
            // eleccion - todos r2
            else if (usuario > 0 && tipo == 0) {
                ReportUsu2 = ReportUsu2.andWhere('visita.usu_numctrl', usuario);
                const reporte1 = await ReportUsu2;
                const reporte2 = reporte1.length;

                res.status(200).json({ result: reporte1, contador: reporte2 });
            }
            // eleccion - eleccion r1
            else if (usuario > 0 && tipo > 0) {

                ReportUsu1 = ReportUsu1.andWhere('visita.usu_numctrl', usuario).andWhere('tipocli.tip_clave', tipo);
                const reporte1 = await ReportUsu1;
                const reporte2 = reporte1.length;

                res.status(200).json({ result: reporte1, contador: reporte2 });
            }

        }
        else {
            let ReportUsu3 = await db
                .select('*')
                .from(function () {
                    const subquery = this.select('visita.vis_fecha', 'cliente.cli_nomcom', 'cliente.cli_cel', 'tipocli.tip_nom')
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

                    // todos - eleccion r1
                    if (usuario == 0 && tipo > 0) {
                        subquery.andWhere('tipocli.tip_clave', tipo);
                    }
                    //  eleccion - eleccion r1
                    else if (usuario > 0 && tipo > 0) {

                        subquery.andWhere('visita.usu_numctrl', usuario).andWhere('tipocli.tip_clave', tipo);
                    }

                    return subquery.as('subquery');
                })
                .whereBetween('vis_fecha', [inicio, fin]);


            let ReportUsu4 = await db
                .select('empleado').sum('visita as visitas')
                .from(function () {
                    const subquery = this.select('visita.vis_fecha as fecha', 'usuario.usu_nombre as empleado').count('visita.cli_clave as visita')
                        .from('visita')
                        .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                        .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                        .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                        .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                        .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
                        .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                        .where('usuario.emp_clave', empresa)
                        .whereBetween('visita.vis_fecha', ['2020-01-01', fin])
                        .groupBy('visita.cli_clave', 'usuario.usu_numctrl')
                        .havingRaw('COUNT(visita.cli_clave) = 1');

                    // eleccion - todos r2
                    if (usuario > 0 && tipo == 0) {
                        subquery.andWhere('visita.usu_numctrl', usuario)
                    }

                    return subquery.as('subquery');
                })
                .whereBetween('fecha', [inicio, fin]);

            // r3
            if ((usuario == 0 && tipo > 0) || (usuario > 0 && tipo > 0)) {
                const report1 = await ReportUsu3
                const report2 = report1.length

                res.status(200).json({ result: report1, contador: report2 });
            }
            // r4
            else if ((usuario > 0 && tipo == 0) || (usuario == 0 && tipo == 0)) {

                const report1 = await ReportUsu4
                // ReportUsu4 = ReportUsu4.select(db.raw('SUM(visitas) as total_visitas'))
                // const report2 = await ReportUsu4
                // res.status(200).json({ result: report1, contador: report2 });
                const totalVisitasConsulta = await db
                    .sum('visita as visitas')
                    .from(function () {
                        const subquery = this.select('visita.vis_fecha as fecha', 'usuario.usu_nombre as empleado').count('visita.cli_clave as visita')
                            .from('visita')
                            .join('usuario', 'visita.usu_numctrl', '=', 'usuario.usu_numctrl')
                            .join('empresa', 'usuario.emp_clave', '=', 'empresa.emp_clave')
                            .join('sucursal', 'visita.suc_clave', '=', 'sucursal.suc_clave')
                            .join('cliente', 'visita.cli_clave', '=', 'cliente.cli_clave')
                            .join('tipocli', 'cliente.tip_clave', '=', 'tipocli.tip_clave')
                            .join('campana', 'visita.suc_clave', '=', 'campana.cam_clave')
                            .where('usuario.emp_clave', empresa)
                            .whereBetween('visita.vis_fecha', ['2020-01-01', fin])
                            .groupBy('visita.cli_clave', 'usuario.usu_numctrl')
                            .havingRaw('COUNT(visita.cli_clave) = 1');

                        // eleccion - todos r2
                        if (usuario > 0 && tipo == 0) {
                            subquery.andWhere('visita.usu_numctrl', usuario)
                        }

                        return subquery.as('subquery');
                    })
                    .groupBy('empleado')
                    .whereBetween('fecha', [inicio, fin])
                    .first();

                res.status(200).json({ result: report1, contador: totalVisitasConsulta.visitas });
            }

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.GrafVis = async (req, res) => {
    try {
        const { empresa, select, inicio, fin } = req.body;

        // Crear un array de todos los días entre inicio y fin
        const dias = [];
        let fechaActual = moment(inicio, 'YYYY-MM-DD');
        const fechaFin = moment(fin, 'YYYY-MM-DD');
        while (fechaActual.isSameOrBefore(fechaFin, 'day')) {
            dias.push(fechaActual.format('YYYY-MM-DD'));
            fechaActual.add(1, 'day');
        }

        const ConsultaRec = await db
            .select(db.raw('DATE(vi.vis_fecha) as Fecha'))
            .count('vi.vis_fecha as total')
            .from(function () {
                this.select('vi.cli_clave as Cliente')
                    .count('vi.cli_clave as visitas')
                    .from('visita as vi')
                    .innerJoin('usuario as us', 'vi.usu_numctrl', 'us.usu_numctrl')
                    .where('us.emp_clave', empresa)
                    .whereBetween('vi.vis_fecha', ['2023-12-01', fin])
                    .groupBy('vi.cli_clave')
                    .having('visitas', '!=', 1)
                    .as('q1');
            })
            .innerJoin('visita as vi', 'vi.cli_clave', 'q1.Cliente')
            .whereBetween('vi.vis_fecha', [inicio, fin])
            .groupBy('Fecha');

        const ConsultaNue = await db
            .select(db.raw('DATE(vi.vis_fecha) as Fecha'))
            .count('vi.vis_fecha as total')
            .from(function () {
                this.select('vi.cli_clave as Cliente')
                    .count('vi.cli_clave as visitas')
                    .from('visita as vi')
                    .innerJoin('usuario as us', 'vi.usu_numctrl', 'us.usu_numctrl')
                    .where('us.emp_clave', empresa)
                    .whereBetween('vi.vis_fecha', ['2023-12-01', fin])
                    .groupBy('vi.cli_clave')
                    .having('visitas', '=', 1)
                    .as('q1');
            })
            .innerJoin('visita as vi', 'vi.cli_clave', 'q1.Cliente')
            .whereBetween('vi.vis_fecha', [inicio, fin])
            .groupBy('Fecha');


        const resultados = {};
        ConsultaRec.forEach((fila) => {
            const fecha = moment(fila.Fecha).format('YYYY-MM-DD');
            resultados[fecha] = fila.total;
        });

        const resultados2 = {};
        ConsultaNue.forEach((fila) => {
            const fecha = moment(fila.Fecha).format('YYYY-MM-DD');
            resultados[fecha] = fila.total;
        });

        if (select == 1) {
            const resultadosOrdenados = dias.map((dia) => ({
                Fecha: dia,
                total: resultados[dia] || 0
            }));
            const resultadosOrdenados2 = dias.map((dia) => ({
                Fecha: dia,
                total: resultados2[dia] || 0
            }));
            res.status(200).json({ result: resultadosOrdenados,result2: resultadosOrdenados2 });
        }
        else {
            const resultadosAgrupados = [];
            for (let i = 0; i < dias.length; i += select) {
                const fechaInicio = dias[i];
                const fechaFinIntervalo = moment(dias[i + (select - 1)] || fin).format('YYYY-MM-DD');
                let totalIntervalo = 0;
                for (let fecha = fechaInicio; fecha <= fechaFinIntervalo; fecha = moment(fecha).add(1, 'day').format('YYYY-MM-DD')) {
                    totalIntervalo += resultados[fecha] || 0;
                }
                resultadosAgrupados.push({ Fecha: `${fechaFinIntervalo}`, total: totalIntervalo });
            }
            const resultadosAgrupados2 = [];
            for (let i = 0; i < dias.length; i += select) {
                const fechaInicio = dias[i];
                const fechaFinIntervalo = moment(dias[i + (select - 1)] || fin).format('YYYY-MM-DD');
                let totalIntervalo = 0;
                for (let fecha = fechaInicio; fecha <= fechaFinIntervalo; fecha = moment(fecha).add(1, 'day').format('YYYY-MM-DD')) {
                    totalIntervalo += resultados2[fecha] || 0;
                }
                resultadosAgrupados2.push({ Fecha: `${fechaFinIntervalo}`, total: totalIntervalo });
            }

            res.status(200).json({ result: resultadosAgrupados, result2: resultadosAgrupados2 });
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
