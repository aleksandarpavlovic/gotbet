const express = require('express');
const router = express.Router();
const dao = require('../dao/ticketDao.js');
const bus = require('../services/bus.js');
const appCommon = require('../common/appCommon.js');

router.get('/', function(req, res){
	handleFetchAllPolling(req.query.dataTimestamp, res);
});

router.post('/', function(req, res){
	console.log(req.body);
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
	handlePolling(clientDataTimestamp, response, function() {return dao.fetchAll();});
};

function handleFetchPolling(id, clientDataTimestamp, response) {
	handlePolling(clientDataTimestamp, response, function() {return dao.fetch(id);});
};

function handlePolling(clientDataTimestamp, response, fetchResponseData) {
	console.log('long polling za tikete');
	bus.updaterTopic.emit('update', Date.now());

	if (!clientDataTimestamp || (dao.getUpdateTimestamp() - clientDataTimestamp >= appCommon.REFRESH_INTERVAL)) {
		response.send(createGetResponse(fetchResponseData()));
	} else {
		// put client connection in queue
		bus.ticketsTopic.once('notify', function() {
			response.send(createGetResponse(fetchResponseData()));
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