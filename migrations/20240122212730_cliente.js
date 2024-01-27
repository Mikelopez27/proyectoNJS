/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('cliente', function (table) {
        table.specificType('cli_clave', 'Int(7) auto_increment primary key');
        table.integer('emp_clave', 5).references("emp_clave").inTable("empresa");
        table.integer('tip_clave', 9).references("tip_clave").inTable("tipocli");
        table.specificType('cli_nomcom', 'Char (80)');
        table.integer('cli_cel', 10);
        table.specificType('cli_corre', 'Char (80)');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("cliente")
};
