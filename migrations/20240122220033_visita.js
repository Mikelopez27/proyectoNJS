/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('visita', function (table) {
        table.integer('usu_numctrl', 9).references("usu_numctrl").inTable("usuario");
        table.integer('suc_clave', 5).references("suc_clave").inTable("sucursal");
        table.integer('cli_clave', 7).references("cli_clave").inTable("cliente");
        table.specificType('vis_fecha', 'datetime primary key');
        table.integer('vis_cam', 9).references("cam_clave").inTable("campana");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("visita")
};
