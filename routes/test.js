const express = require('express');
const router = express.Router();
const fandom = require('../services/fandomSvc.js');
const dao = require('../dao/characterDao.js');
const charSvc = require('../services/characterSvc.js');
const Character = require('../models/character.js');
const STATUS = require('../models/status.js');

router.post('/updatedb', function(req, res){
	console.log("pozvan update");
	res.send('updating db');
	dao.save(new Character("2123", "John Snow", STATUS.UNKNOWN));
	dao.save(new Character("2128", "Sansa Stark", STATUS.UNKNOWN));
	dao.save(new Character("2129", "Arya Stark", STATUS.UNKNOWN));
	dao.save(new Character("22351", "Bran Stark", STATUS.UNKNOWN));
	dao.save(new Character("2104", "Cersei Lannister", STATUS.UNKNOWN));
	dao.save(new Character("2103", "Jaime Lannister", STATUS.UNKNOWN));
	dao.save(new Character("2091", "Tyrion Lannister", STATUS.UNKNOWN));
	dao.save(new Character("2157", "Daenerys Targaryen", STATUS.UNKNOWN));
	dao.save(new Character("4278", "Yaara Greyjoy", STATUS.UNKNOWN));
	dao.save(new Character("2171", "Theon Greyjoy", STATUS.UNKNOWN));
	dao.save(new Character("4370", "Melisandre", STATUS.UNKNOWN));
	dao.save(new Character("2175", "Jorah Mormont", STATUS.UNKNOWN));
	dao.save(new Character("2174", "The Hound", STATUS.UNKNOWN));
	dao.save(new Character("2196", "The Mountain", STATUS.UNKNOWN));
	dao.save(new Character("2235", "Samwell Tarley", STATUS.UNKNOWN));
	dao.save(new Character("4585", "Gilly", STATUS.UNKNOWN));
	dao.save(new Character("14952", "Sam (child)", STATUS.UNKNOWN));
	dao.save(new Character("2222", "Lord Varys", STATUS.UNKNOWN));
	dao.save(new Character("4261", "Brienne of Tarth", STATUS.UNKNOWN));
	dao.save(new Character("3164", "Davos Seaworth", STATUS.UNKNOWN));
	dao.save(new Character("2248", "Bronn", STATUS.UNKNOWN));
	dao.save(new Character("4704", "Podrick Payne", STATUS.UNKNOWN));
	dao.save(new Character("9679", "Tormund Giantsbane", STATUS.UNKNOWN));
	dao.save(new Character("11939", "Grey Worm", STATUS.UNKNOWN));
	dao.save(new Character("2326", "Gendry", STATUS.UNKNOWN));
	dao.save(new Character("2379", "Beric Dondarrion", STATUS.UNKNOWN));
	dao.save(new Character("5695", "Euron Greyjoy", STATUS.UNKNOWN));54431
	dao.save(new Character("54431", "Ned Umber", STATUS.UNKNOWN));
});

router.post('/refreshStatuses', function(req, res){
	Promise.resolve(dao.fetchAllIds())
	.then(fandom.fetchStatuses)
	.then(charSvc.updateStatuses);
	res.send('refreshing statuses...');
});

router.post('/refreshStatuses/:id', function(req, res) {
	Promise.resolve([req.params.id])
	.then(fandom.fetchStatuses)
	.then(charSvc.updateStatuses);
	res.send('refreshing status for ${req.params.id}...');
});

// router.get('/statuses', async function(req, res){
// 	res.send(await fandom.fetchStatuses(["2123", "2128", "2041", "5"]));
// });

//export this router
module.exports = router;