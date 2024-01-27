/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('empresa').del()
  await knex('usuario').del()
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
      emp_clave: 1, 
      usu_correo: 'usuario2@empresa2.com',
      usu_nombre: 'Usuario 2',
      usu_contra: 'abcdef',
      usu_estatus: true,
      usu_tipo: 2
    }
  ]);
};
