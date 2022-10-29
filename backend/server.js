const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const routes = require('./src/routes/index');
const cookieParser = require('cookie-parser');
const app = express();
const corsOptions = {
	origin: '*'
	// some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/', routes);

app.listen(process.env.PORT_APP, () => {
	console.log(`Server Running On Port ${process.env.PORT_APP}`);
});
module.exports = app;
