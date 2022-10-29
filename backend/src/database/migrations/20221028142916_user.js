/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('users', (table) => {
		table.increments('id');
		table.string('username', 30).notNullable();
		table.string('email', 50).notNullable().unique();
		table.string('password', 191).notNullable();
		table.timestamps();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('users');
};
