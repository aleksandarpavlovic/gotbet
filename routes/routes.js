const express = require('express');
const router = express.Router();
const fandom = require('../services/fandom.js');

router.get('/', function(req, res){
	res.send('You know nothing, Jon Snow!');
});
router.post('/', function(req, res){
	res.send('You posted nothing, Jon Snow!');
});

router.get('/statuses', async function(req, res){
	res.send(await fandom.fetchStatuses(["2123", "2128", "2041", "5"]));
});

//export this router
module.exports = router;