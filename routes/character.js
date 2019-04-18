const express = require('express');
const router = express.Router();
const dao = require('../dao/characterDao.js');

router.get('/', function(req, res){
	console.log("pozvan get all characters");
	res.send(dao.fetchAll());
});

router.post('/', function(req, res){
	console.log("pozvan post character");
	res.send('You posted nothing, Jon Snow!');
});

router.get('/:id', function(req, res){
	console.log("pozvan get character");
	res.send(dao.fetch(req.params.id));
});

router.delete('/:id', function(req, res){
	console.log("brisanje karaktera");
	dao.remove(req.params.id);
	res.send('obrisan karakter ${req.params.id}');
});

router.delete('/', function(req, res){
	console.log("brisanje svih karaktera");
	dao.removeAll();
	res.send('obrisan karakter repo');
});

// router.get('/statuses', async function(req, res){
// 	res.send(await fandom.fetchStatuses(["2123", "2128", "2041", "5"]));
// });

//export this router
module.exports = router;