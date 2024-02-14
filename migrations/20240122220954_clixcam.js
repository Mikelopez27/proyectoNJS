/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('clixcam', function (table) {
        table.integer('emp_clave', 5).references("emp_clave").inTable("empresa").onDelete("CASCADE");
        table.integer('cam_clave', 7).references("cam_clave").inTable("campana").onDelete("CASCADE");
        table.integer('cli_clave', 7).references("cli_clave").inTable("cliente").onDelete("CASCADE");
        table.date('cxc_fecha').defaultTo(knex.fn.now());
        table.boolean('cxc_estatus').defaultTo(true);;
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("clixcam")
};
