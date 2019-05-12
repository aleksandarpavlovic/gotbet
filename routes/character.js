const express = require('express');
const router = express.Router();
const bus = require('../services/bus.js');
const appConf = require('../conf/appConf.js');
const dao = require(`../dao/${appConf.DAO_IMPL}/characterDao.js`);

router.get('/', function(req, res){
	handleFetchAllPolling(req.query.dataTimestamp, res);
});

router.post('/', function(req, res){
	// console.log(req.body);
	dao.createAll(req.body);
	res.send(req.body);
});

router.get('/:id', function(req, res){
	handleFetchPolling(req.params.id, req.query.dataTimestamp, res);
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

function handleFetchAllPolling(clientDataTimestamp, response) {
	// handlePolling(clientDataTimestamp, response, function() {return dao.fetchAll();});
	handlePolling(clientDataTimestamp, response, () => dao.fetchAll());
};

function handleFetchPolling(id, clientDataTimestamp, response) {
	// handlePolling(clientDataTimestamp, response, function() {return dao.fetch(id);});
	handlePolling(clientDataTimestamp, response, () => dao.fetch(id));
};

async function handlePolling(clientDataTimestamp, response, fetchResponseData) {
	console.log('long polling za karaktere');
	bus.updaterTopic.emit('update', Date.now());
	if (!clientDataTimestamp || (dao.getUpdateTimestamp() - clientDataTimestamp >= appConf.FANDOM_REFRESH_INTERVAL)) {
		response.send(createGetResponse(await fetchResponseData()));
	} else {
		// put client connection in queue, and respond when the data has updated
		bus.charactersTopic.once('notify', async function() {
			response.send(createGetResponse(await fetchResponseData()));
			// TODO hendlaj slucaj da je konekcija zatvorena
		});
	}
}

function createGetResponse(data) {
	let response = {};
	response.dataTimestamp = dao.getUpdateTimestamp();
	response.data = data;
	return response;
}

//export this router
module.exports = router;