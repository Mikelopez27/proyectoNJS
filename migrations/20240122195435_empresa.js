/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {

    return knex.schema
        .createTable('empresa', function (table) {
            table.specificType('emp_clave', 'Int(5) auto_increment primary key');
            table.specificType('emp_nomcom', 'Char (80)');
            table.specificType('emp_razon', 'Char (80)');
            table.integer('emp_cp', 5);
            table.specificType('emp_calle', 'Char (50)');
            table.specificType('emp_col', 'Char (50)');
            table.specificType('emp_cd', 'Char (50)');
            table.specificType('emp_conta1', 'Char (50)');
            table.integer('emp_cel1', 10);
            table.specificType('emp_conta2', 'Char (50)');
            table.integer('emp_cel2', 10);
            table.boolean('emp_status').defaultTo(true);
        });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("empresa")
};
