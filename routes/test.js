const appConf = require('../conf/appConf.js');
const express = require('express');
const router = express.Router();
const fandom = require('../services/fandomSvc.js');
const dao = require(`../dao/${appConf.DAO_IMPL}/characterDao.js`);
const charSvc = require('../services/characterSvc.js');
const Character = require('../models/character.js');
const STATUS = require('../models/status.js');

router.post('/updatedb', function(req, res){
	console.log("pozvan update");
	res.send('updating db');
	dao.createAll(
		[new Character("2123", "John Snow", STATUS.UNKNOWN),
		new Character("2128", "Sansa Stark", STATUS.UNKNOWN),
		new Character("2129", "Arya Stark", STATUS.UNKNOWN),
		new Character("22351", "Bran Stark", STATUS.UNKNOWN),
		new Character("2104", "Cersei Lannister", STATUS.UNKNOWN),
		new Character("2103", "Jaime Lannister", STATUS.UNKNOWN),
		new Character("2091", "Tyrion Lannister", STATUS.UNKNOWN),
		new Character("2157", "Daenerys Targaryen", STATUS.UNKNOWN),
		new Character("4278", "Yaara Greyjoy", STATUS.UNKNOWN),
		new Character("2171", "Theon Greyjoy", STATUS.UNKNOWN),
		new Character("5695", "Euron Greyjoy", STATUS.UNKNOWN),
		new Character("4370", "Melisandre", STATUS.UNKNOWN),
		new Character("2175", "Jorah Mormont", STATUS.UNKNOWN),
		new Character("2174", "The Hound", STATUS.UNKNOWN),
		new Character("2196", "The Mountain", STATUS.UNKNOWN),
		new Character("2235", "Samwell Tarley", STATUS.UNKNOWN),
		new Character("4585", "Gilly", STATUS.UNKNOWN),
		new Character("14952", "Sam (child)", STATUS.UNKNOWN),
		new Character("2222", "Lord Varys", STATUS.UNKNOWN),
		new Character("4261", "Brienne of Tarth", STATUS.UNKNOWN),
		new Character("3164", "Davos Seaworth", STATUS.UNKNOWN),
		new Character("2248", "Bronn", STATUS.UNKNOWN),
		new Character("4704", "Podrick Payne", STATUS.UNKNOWN),
		new Character("9679", "Tormund Giantsbane", STATUS.UNKNOWN),
		new Character("11939", "Grey Worm", STATUS.UNKNOWN),
		new Character("2326", "Gendry", STATUS.UNKNOWN),
		new Character("2379", "Beric Dondarrion", STATUS.UNKNOWN),
		new Character("54431", "Ned Umber", STATUS.UNKNOWN),
		new Character("31891", "Lyanna Mormont", STATUS.UNKNOWN)]
	);
});

router.post('/refreshStatuses', function(req, res){
	dao.fetchAllIds()
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

module.exports = router;