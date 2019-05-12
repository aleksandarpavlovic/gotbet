const appConf = require('../conf/appConf.js');
const express = require('express');
const router = express.Router();
const svc = require('../services/ticketSvc.js');
const dao = require(`../dao/${appConf.DAO_IMPL}/ticketDao.js`);
const bus = require('../services/bus.js');

router.get('/', function(req, res){
	handleFetchAllPolling(req.query.dataTimestamp, res);
});

router.get('/dto', function(req, res){
	handleFetchAllDTOPolling(req.query.dataTimestamp, res);
});

router.post('/', function(req, res){
	// console.log(req.body);
	dao.createAll(req.body);
	res.send(req.body);
});

router.put('/:id', function(req, res){
	dao.update(req.params.id, req.body);
	res.send('200');
});

router.get('/:id', function(req, res){
	handleFetchPolling(req.params.id, req.query.dataTimestamp, res);
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

function handleFetchAllPolling(clientDataTimestamp, response) {
	// handlePolling(clientDataTimestamp, response, function() {return dao.fetchAll();});
	handlePolling(clientDataTimestamp, response, () => dao.fetchAll());
};

function handleFetchAllDTOPolling(clientDataTimestamp, response) {
	// handlePolling(clientDataTimestamp, response, function() {return svc.fetchRanked();});
	handlePolling(clientDataTimestamp, response, () => svc.fetchRanked());
};

function handleFetchPolling(id, clientDataTimestamp, response) {
	// handlePolling(clientDataTimestamp, response, function() {return dao.fetch(id);});
	handlePolling(clientDataTimestamp, response, () => dao.fetch(id));
};

async function handlePolling(clientDataTimestamp, response, fetchResponseData) {
	console.log('long polling za tikete');
	bus.updaterTopic.emit('update', Date.now());

	if (!clientDataTimestamp || (dao.getUpdateTimestamp() - clientDataTimestamp >= appConf.FANDOM_REFRESH_INTERVAL)) {
		response.send(createGetResponse(await fetchResponseData()));
	} else {
		// put client connection in queue
		bus.ticketsTopic.once('notify', async function() {
			response.send(createGetResponse(await fetchResponseData()));
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