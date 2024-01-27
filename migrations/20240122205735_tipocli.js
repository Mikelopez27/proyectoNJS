/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('tipocli', function (table) {
        table.specificType('tip_clave', 'Int(9) primary key');
        table.specificType('tip_nom', 'Char (60)');
        table.text('tip_desc');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("tipocli")
};
