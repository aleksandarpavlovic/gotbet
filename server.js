const express = require('Express');
const app = express();
const port = 3000

const routes = require('./routes/routes.js');

app.use('/', routes);

app.listen(port);