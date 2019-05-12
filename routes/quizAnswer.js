const express = require('express');
const router = express.Router();
const appConf = require('../conf/appConf.js');
const dao = require(`../dao/${appConf.DAO_IMPL}/quizAnswerDao.js`);
const bus = require('../services/bus.js');

router.get('/', async function(req, res){
	res.send(await dao.fetchAll());
});

router.post('/', async function(req, res){
	// console.log(req.body);
	await dao.createAll(req.body);
	res.send(req.body);
	bus.updaterTopic.emit('update', Date.now());
});

router.put('/:id', async function(req, res){
	console.log("pozvan put answer");
	await dao.update(req.params.id, req.body);
	res.send(req.body);
	bus.updaterTopic.emit('update', Date.now());
});

router.get('/:id', async function(req, res){
	res.send(await dao.fetch(req.params.id));
});

router.delete('/:id', function(req, res){
	console.log("brisanje answera");
	dao.remove(req.params.id);
	res.send('obrisan answer ${req.params.id}');
});

router.delete('/', function(req, res){
	console.log("brisanje svih answera");
	dao.removeAll();
	res.send('obrisan answer repo');
});

//export this router
module.exports = router;