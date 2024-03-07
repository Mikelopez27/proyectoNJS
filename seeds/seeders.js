/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('empresa').del()
  await knex('usuario').del()
  await knex('tipocli').del()
  await knex('sucursal').del()
  await knex('campana').del()
  await knex('cliente').del()
  await knex('visita').del()
  await knex('clixcam').del()


  await knex('empresa').insert([
    {
      emp_nomcom: 'Empresa 1',
      emp_razon: 'Razón Social 1',
      emp_cp: 12345,
      emp_calle: 'Calle 1',
      emp_col: 'Colonia 1',
      emp_cd: 'Ciudad 1',
      emp_conta1: 'Contacto 1',
      emp_cel1: 1234567890,
      emp_conta2: 'Contacto 2',
      emp_cel2: 9876543210,
      emp_status: true
    },
    {
      emp_nomcom: 'Empresa 2',
      emp_razon: 'Razón Social 2',
      emp_cp: 54321,
      emp_calle: 'Calle 2',
      emp_col: 'Colonia 2',
      emp_cd: 'Ciudad 2',
      emp_conta1: 'Contacto 3',
      emp_cel1: 1112233444,
      emp_conta2: 'Contacto 4',
      emp_cel2: 5566778899,
      emp_status: true
    }
  ]);

  await knex('usuario').insert([
    {
      emp_clave: 1,
      usu_correo: 'usuario1@empresa1.com',
      usu_nombre: 'Usuario 1',
      usu_contra: '123456',
      usu_estatus: true,
      usu_tipo: 1
    },
    {
      emp_clave: 2,
      usu_correo: 'usuario2@empresa2.com',
      usu_nombre: 'Usuario 2',
      usu_contra: 'abcdef',
      usu_estatus: true,
      usu_tipo: 2
    }
  ]);

  await knex('tipocli').insert([
    {
      TIP_CLAVE: 1,
      EMP_CLAVE: 2,
      TIP_NOM: "Tipo 1",
      TIP_DESC: "Descripción del Tipo 1"
    }
    ,
    {
      TIP_CLAVE: 2,
      EMP_CLAVE: 1,
      TIP_NOM: "Tipo 2",
      TIP_DESC: "Descripción del Tipo 2"
    }

  ]);

  await knex('sucursal').insert([

    {
      EMP_CLAVE: 1,
      SUC_NOM: "Sucursal 1",
      SUC_TEL: 1234567890,
      SUC_CONTA: "Contacto 1",
      SUC_CEL: 9876543210,
      SUC_CALLE: "Calle 1",
      SUC_COL: "Colonia 1"
    }
    ,

    {
      EMP_CLAVE: 2,
      SUC_NOM: "Sucursal 2",
      SUC_TEL: 9876543210,
      SUC_CONTA: "Contacto 2",
      SUC_CEL: 1234567890,
      SUC_CALLE: "Calle 2",
      SUC_COL: "Colonia 2"
    }

  ]);

  await knex('campana').insert([
    {
      EMP_CLAVE: 1,
      TIP_CLAVE: 1,
      CAM_NOM: "Campaña 1",
      CAM_DESC: "Descripción de la Campaña 1",
      CAM_LANZA: "2024-01-20"
    }
    ,
    {
      EMP_CLAVE: 2,
      TIP_CLAVE: 2,
      CAM_NOM: "Campaña 2",
      CAM_DESC: "Descripción de la Campaña 2",
      CAM_LANZA: "2024-01-23"
    }

  ]);

  await knex('cliente').insert([
    {
      emp_clave: 1,
      tip_clave: 2,
      cli_nomcom: 'Cliente 1',
      cli_cel: 1234567890,
      cli_correo: 'cliente1@example.com'
    }
    ,
    {
      emp_clave: 2,
      tip_clave: 1,
      cli_nomcom: 'Cliente 2',
      cli_cel: 9876543210,
      cli_correo: 'cliente2@example.com'
    },
    {
      emp_clave: 1,
      tip_clave: 2,
      cli_nomcom: 'Cliente 3',
      cli_cel: 3216549870,
      cli_correo: 'cliente3@example.com'
    },
    {
      emp_clave: 2,
      tip_clave: 1,
      cli_nomcom: 'Cliente 4',
      cli_cel: 9875462301,
      cli_correo: 'cliente4@example.com'
    }
  ]);

  await knex('visita').insert([
    {
      usu_numctrl: 1,
      suc_clave: 1,
      cli_clave: 1,
      vis_fecha: '2024-01-18 10:30:00',
      vis_cam: 1
    }
    ,
    {
      usu_numctrl: 2,
      suc_clave: 2,
      cli_clave: 2,
      vis_fecha: '2024-01-19 15:45:00',
      vis_cam: 2
    }
    ,
    {
      usu_numctrl: 1,
      suc_clave: 1,
      cli_clave: 1,
      vis_fecha: '2024-01-19 15:45:10',
      vis_cam: 1
    }
    ,
    {
      usu_numctrl: 2,
      suc_clave: 2,
      cli_clave: 2,
      vis_fecha: '2024-01-20 15:45:00',
      vis_cam: 2
    }
    ,
    {
      usu_numctrl: 1,
      suc_clave: 1,
      cli_clave: 3,
      vis_fecha: '2024-01-20 15:45:10',
      vis_cam: 1
    }
    ,
    {
      usu_numctrl: 2,
      suc_clave: 2,
      cli_clave: 4,
      vis_fecha: '2023-12-27 15:45:00',
      vis_cam: 2
    }

  ]);

  await knex('clixcam').insert([
    {
      emp_clave: 1,
      cam_clave: 1,
      cli_clave: 1,
      cxc_fecha: '2024-01-18'
    }
    ,
    {
      emp_clave: 2,
      cam_clave: 2,
      cli_clave: 2,
      cxc_fecha: '2024-01-19'
    },
    {
      emp_clave: 1,
      cam_clave: 1,
      cli_clave: 3,
      cxc_fecha: '2024-01-17'
    }
    ,{
      emp_clave: 2,
      cam_clave: 2,
      cli_clave: 4,
      cxc_fecha: '2023-12-27'
    }

  ]);
};
