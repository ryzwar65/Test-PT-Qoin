const jwt = require('jsonwebtoken');
const accessTokenSecret = '53c!23t';
exports.authJWT = (request, response, next) => {
	const authHeader = request.headers.authorization;

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];

		jwt.verify(token, accessTokenSecret, (err, user) => {
			if (err) {
				return response.sendStatus(403);
			}

			request.user = user;
			next();
		});
	} else {
		response.status(401).json({
			status: '401',
			error: 'Not Authorized'
		});
	}
};
