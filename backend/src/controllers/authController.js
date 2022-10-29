const db = require('../database/connection');
const bcrypt = require('bcrypt');
// const { loginMapper } = require('../mappers/loginMapper');
const jwt = require('jsonwebtoken');
const accessTokenSecret = '53c!23t';
const refreshTokenSecret = '53c!23tashdashdhas1238123';

exports.login = async (request, response) => {
	try {
		const { email, password } = request.body;
		const user = await db('users').where('email', email).first();
		if (user != undefined && bcrypt.compareSync(password, user.password)) {
			const accessToken = jwt.sign({ email: user.email }, accessTokenSecret, {
				expiresIn: '20s'
			});
			const refreshToken = jwt.sign({ email: user.email }, refreshTokenSecret, {
				expiresIn: '1d'
			});
			// const map = loginMapper(user, 201, accessToken);
			return response
				.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					maxAge: 24 * 60 * 60 * 1000
				})
				.status(201)
				.json({
					message: 'Anda berhasil login',
					auth: true,
					token: accessToken
				});
		} else {
			return response.status(404).json({
				message: 'Password atau email salah',
				auth: false
			});
		}
	} catch (error) {
		console.log(error);
		// const map = loginMapper(error, 404, null);
		return response.status(404).json(error);
	}
};

exports.register = async (request, response) => {
	try {
		const { email, password, username } = request.body;
		await db('users').insert({
			email: email,
			password: bcrypt.hashSync(password, 10),
			username: username
		});
		const user = await db('users').where('email', email).first();
		return response.status(201).json({
			message: 'Anda berhasil Mendaftar',
			data: user
		});
	} catch (error) {
		throw new Error(error);
	}
};

exports.refreshToken = async (request, response) => {
	try {
		const refreshToken = request.cookies.refreshToken;
		if (!refreshToken) {
			return response.status(401).json({
				message: 'Unauthorized'
			});
		} else {
			jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
				if (err) {
					return response.sendStatus(403);
				}

				const accessToken = jwt.sign({ email: user.email }, accessTokenSecret, {
					expiresIn: '20s'
				});
				return response.status(201).json({
					message: 'Anda berhasil login',
					auth: true,
					token: accessToken
				});
			});
		}
	} catch (error) {
		throw new Error(error);
	}
};

exports.logout = async (request, response) => {
	const refreshToken = request.cookies.refreshToken;
	if (!refreshToken) {
		return response.status(401).json({
			message: 'Unauthorized'
		});
	} else {
		response.clearCookie('refreshToken');
		return response.status(200).json({
			message: 'Anda berhasil logout'
		});
	}
};
