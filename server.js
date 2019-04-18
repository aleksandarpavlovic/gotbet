const express = require('Express');
const app = express();
const port = 3000

// app.use(express.urlencoded({extended: false}));
app.use(express.json());

const characterRoutes = require('./routes/character.js');
const testRoutes = require('./routes/test.js');
const ticketRoutes = require('./routes/ticket.js');

app.use('/api/characters', characterRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/test', testRoutes);

app.listen(port);