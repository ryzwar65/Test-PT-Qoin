/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('history_game', (table) => {
		table.increments('id');
		table.integer('user_id').unsigned().notNullable();
		table
			.foreign('user_id')
			.references('users.id')
			.withKeyName('fk_fkey_users_h')
			.onDelete('cascade')
			.onUpdate('cascade');
		table.integer('as_player').unsigned().notNullable();
		table.string('room', 191).notNullable();
		table.string('dice', 100).notNullable();
		table.integer('poin').unsigned().notNullable();
		table.integer('roll_dice').unsigned().notNullable(); // isinya contoh putaran ke 1 2 3 dst
		table.string('status_player').notNullable(); // isinya menang, kalah, dalam permainan
		table.timestamps();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	knex.schema.table('history_game', (table) => {
		table.dropForeign('user_id', [ 'fk_fkey_users_h' ]);
	});
	return knex.schema.dropTable('history_game');
};
