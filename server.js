const express = require('Express');
const app = express();
const port = 3000

app.use(express.json());

const bus = require('./services/bus.js');
const UpdaterService = require('./services/updaterSvc.js');
const updaterSvc = new UpdaterService();

bus.updaterTopic.on('update', updaterSvc.onClientRequest);

const characterRoutes = require('./routes/character.js');
const testRoutes = require('./routes/test.js');
const ticketRoutes = require('./routes/ticket.js');
const quizAnswerRoutes = require('./routes/quizAnswer.js');

app.use('/api/characters', characterRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/test', testRoutes);
app.use('/api/quizanswers', quizAnswerRoutes)

app.listen(port);