const express = require('express');
const router = express.Router();
const dao = require('../dao/quizAnswerDao.js');
const bus = require('../services/bus.js');
const appCommon = require('../common/appCommon.js');

router.get('/', function(req, res){
	res.send(dao.fetchAll());
});

router.post('/', function(req, res){
	// console.log(req.body);
	dao.createAll(req.body);
	res.send(req.body);
	bus.updaterTopic.emit('update', Date.now());
});

router.put('/:id', function(req, res){
	console.log("pozvan put answer");
	dao.update(req.params.id, req.body);
	res.send(req.body);
	bus.updaterTopic.emit('update', Date.now());
});

router.get('/:id', function(req, res){
	res.send(dao.fetch(req.params.id));
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