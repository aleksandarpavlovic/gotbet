const express = require('express');
const router = express.Router();
const fandom = require('../services/fandomSvc.js');
const dao = require('../dao/characterDao.js');
const Character = require('../models/character.js');
const STATUS = require('../models/statuses.js');

router.get('/updatedb', function(req, res){
	console.log("pozvan update");
	res.send('updating db');
	c1 = new Character("1", "pera", STATUS.ALIVE);
	c2 = new Character("2", "zika", STATUS.ALIVE);
	c3 = new Character("3", "mika", STATUS.WHITE_WALKER);
	dao.saveAll([c1, c2, c3]);
});

// router.get('/statuses', async function(req, res){
// 	res.send(await fandom.fetchStatuses(["2123", "2128", "2041", "5"]));
// });

//export this router
module.exports = router;