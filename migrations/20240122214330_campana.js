/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('campana', function (table) {
        table.specificType('cam_clave', 'Int(7) auto_increment primary key');
        table.integer('emp_clave', 5).references("emp_clave").inTable("empresa").onDelete("CASCADE");
        table.integer('tip_clave', 9).references("tip_clave").inTable("tipocli").onDelete("CASCADE");
        table.specificType('cam_nom', 'Char (80)');
        table.text('cam_desc');
        table.date('cam_lanza');
        table.text('cam_mensaje');
        table.specificType('cam_imagen','LONGBLOB');
        table.date('cam_crea').defaultTo(knex.fn.now());
        table.boolean('cam_estatus');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("campana")
};
