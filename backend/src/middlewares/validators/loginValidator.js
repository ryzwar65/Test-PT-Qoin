const Joi = require('joi');

const middleware = async (request, response, next) => {
	const schemas = Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().min(10).required()
	});
	const result = Joi.validate(request.body, schemas);
	var { value, error } = result;
	const valid = error == null;

	if (valid) {
		return next();
	} else {
		const { details } = error;
		// const message = details.map((i) => i.message).join(',');
		return response.status(422).json({ error: details });
	}
};
module.exports = middleware;
