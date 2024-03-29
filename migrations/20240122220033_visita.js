/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('visita', function (table) {
        table.integer('usu_numctrl', 9).references("usu_numctrl").inTable("usuario").onDelete("CASCADE");
        table.integer('suc_clave', 5).references("suc_clave").inTable("sucursal").onDelete("CASCADE");
        table.integer('cli_clave', 7).references("cli_clave").inTable("cliente").onDelete("CASCADE");
        table.specificType('vis_fecha', 'datetime primary key').defaultTo(knex.fn.now());
        table.integer('vis_cam', 9).references("cam_clave").inTable("campana").onDelete("CASCADE");
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
