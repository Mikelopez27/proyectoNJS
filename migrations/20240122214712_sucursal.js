/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('sucursal', function (table) {
        table.specificType('suc_clave', 'Int(5) auto_increment primary key');
        table.integer('emp_clave', 5).references("emp_clave").inTable("empresa").onDelete("CASCADE");
        table.specificType('suc_nom', 'Char (80)');
        table.integer('suc_tel', 10);
        table.specificType('suc_conta', 'Char (80)');
        table.integer('suc_cel', 10);
        table.specificType('suc_calle', 'Char (50)');
        table.specificType('suc_col', 'Char (50)');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("sucursal")
};
