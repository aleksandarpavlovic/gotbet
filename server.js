const appConf = require('./conf/appConf.js');
const dbconnection = require(`./dao/${appConf.DAO_IMPL}/connection.js`);
dbconnection.init(() => initApplication());

const exitHook = require('exit-hook');
exitHook(() => {
  if (dbconnection)
    dbconnection.close();
});

function initApplication() {
  const express = require('express');
  const app = express();
  
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
  app.listen(appConf.PORT);

  console.log('Application started');
}