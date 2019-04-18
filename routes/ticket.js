const express = require('express');
const router = express.Router();
const dao = require('../dao/ticketDao.js');

router.get('/', function(req, res){
	res.send(dao.fetchAll());
});

router.post('/', function(req, res){
	dao.save(req.body);
	res.send('200');
});

router.put('/:id', function(req, res){
	dao.update(req.params.id, req.body);
	res.send('200');
});

router.get('/:id', function(req, res){
	res.send(dao.fetch(req.params.id));
});

router.delete('/:id', function(req, res){
	console.log("brisanje tiketa");
	dao.remove(req.params.id);
	res.send('obrisan tiket ${req.params.id}');
});

router.delete('/', function(req, res){
	console.log("brisanje svih tiket");
	dao.removeAll();
	res.send('obrisan tiket repo');
});

//export this router
module.exports = router;