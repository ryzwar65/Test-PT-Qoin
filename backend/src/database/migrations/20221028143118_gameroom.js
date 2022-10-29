/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('game_rooms', (table) => {
		table.increments('id');
		table.integer('user_id').unsigned().notNullable();
		table
			.foreign('user_id')
			.references('users.id')
			.withKeyName('fk_fkey_users')
			.onDelete('cascade')
			.onUpdate('cascade');
		table.integer('as_player').unsigned().notNullable();
		table.string('room', 191).notNullable();
		table.timestamps();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	knex.schema.table('game_rooms', (table) => {
		table.dropForeign('user_id', [ 'fk_fkey_users' ]);
	});
	return knex.schema.dropTable('game_rooms');
};
