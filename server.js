const express = require('Express');
const app = express();
const port = 3000

const characterRoutes = require('./routes/character.js');
const testRoutes = require('./routes/test.js');

app.use('/api/characters', characterRoutes);
app.use('/api/test', testRoutes);

app.listen(port);