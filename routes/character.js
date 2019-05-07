const express = require('express');
const router = express.Router();
const dao = require('../dao/characterDao.js');
const bus = require('../services/bus.js');
const appCommon = require('../common/appCommon.js');

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

// router.get('/statuses', async function(req, res){
// 	res.send(await fandom.fetchStatuses(["2123", "2128", "2041", "5"]));
// });

function handleFetchAllPolling(clientDataTimestamp, response) {
	handlePolling(clientDataTimestamp, response, function() {return dao.fetchAll();});
};

function handleFetchPolling(id, clientDataTimestamp, response) {
	handlePolling(clientDataTimestamp, response, function() {return dao.fetch(id);});
};

function handlePolling(clientDataTimestamp, response, fetchResponseData) {
	console.log('long polling za karaktere');
	bus.updaterTopic.emit('update', Date.now());

	if (!clientDataTimestamp || (dao.getUpdateTimestamp() - clientDataTimestamp >= appCommon.REFRESH_INTERVAL)) {
		response.send(createGetResponse(fetchResponseData()));
	} else {
		// put client connection in queue, and respond when the data has updated
		bus.charactersTopic.once('notify', function() {
			response.send(createGetResponse(fetchResponseData()));
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