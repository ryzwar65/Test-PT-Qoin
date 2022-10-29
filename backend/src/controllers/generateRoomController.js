const db = require('../database/connection');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const accessTokenSecret = '53c!23t';

exports.generate = async (req, res) => {
	var check = await db('game_rooms')
		.select(db.raw('user_id,count(game_rooms.id) as total_player, max(as_player) as last_player, room'))
		.groupBy('game_rooms.room');
	const authHeader = req.headers.authorization;
	if (check.length > 0) {
		const token = authHeader.split('Bearer ')[1];
		const authUser = jwt.decode(token, { complete: true });
		const user = await db('users').where('email', authUser.payload.email).first();
		check.map(async (val) => {
			var lastRoom = await db('game_rooms').where('room', val.room).orderBy('id', 'desc').first();
			if (val.last_player < 3 && user.id != lastRoom.user_id) {
				await db('game_rooms').insert({
					user_id: user.id,
					as_player: val.last_player + 1,
					room: val.room
				});
				const firstGR = await db('game_rooms').where('room', val.room).orderBy('id', 'desc').first();
				console.log(firstGR);
				return res.status(201).json({
					message: 'Anda Berhasil Masuk Room',
					data: firstGR
				});
			}
		});
		return res.status(400).json({
			message: 'Anda sudah masuk room'
		});
	} else {
		const room = uuidv4();
		const token = authHeader.split('Bearer ')[1];
		const authUser = jwt.decode(token, { complete: true });
		const user = await db('users').where('email', authUser.payload.email).first();
		const generateRoom = await db('game_rooms').insert({
			user_id: user.id,
			as_player: 1,
			room: room
		});
		const firstGR = await db('game_rooms').where('room', room).orderBy('id', 'desc').first();
		console.log(firstGR);
		return res.status(201).json(firstGR);
	}
};
