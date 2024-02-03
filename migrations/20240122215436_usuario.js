/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('usuario', function (table) {
            table.specificType('usu_numctrl', 'Int(9) auto_increment primary key');
            table.integer('emp_clave', 5).references("emp_clave").inTable("empresa").onDelete("CASCADE");
            table.specificType('usu_correo', 'Char (80)');
            table.specificType('usu_nombre', 'Char (80)');
            table.specificType('usu_contra', 'Char (6)');
            table.boolean("usu_estatus");
            table.integer("usu_tipo", 1);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("usuario")
};
