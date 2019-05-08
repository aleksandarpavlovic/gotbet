const express = require('express');
const app = express();
const DEFAULT_PORT = 3000

app.use(express.json());

const bus = require('./services/bus.js');
const UpdaterService = require('./services/updaterSvc.js');
const updaterSvc = new UpdaterService();

bus.updaterTopic.on('update', updaterSvc.onClientRequest);

const characterRoutes = require('./routes/character.js');
const testRoutes = require('./routes/test.js');
const ticketRoutes = require('./routes/ticket.js');
const quizAnswerRoutes = require('./routes/quizAnswer.js');
const htmlRoutes = require('./routes/html.js');

app.use('/api/characters', characterRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/test', testRoutes);
app.use('/api/quizanswers', quizAnswerRoutes);
app.use('/', htmlRoutes);

app.use(express.static(__dirname + "/resources/static"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = DEFAULT_PORT;
}
app.listen(port);