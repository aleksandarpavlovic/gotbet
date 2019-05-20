const appConf = require('../conf/appConf.js');
const dao = require(`../dao/${appConf.DAO_IMPL}/ticketDao.js`);
const STATUS = require('../models/status.js');
const QUESTION = require('../models/question.js');
const EventEmitter = require('events').EventEmitter;

const SCORING = {
	CORRECT_STATUS : 1,
	CORRECT_WW_STATUS : 2,
	PREGNANCY : 1,
	NIGHT_KING_SLAYER : 2,
	THRONE_RULLER : 4
};

const ticketEventEmitter = new EventEmitter();

// racuna poene za ticket i vraca ticket
function calculatePoints(ticket, results) {
	let total = 0;
	let statusHits = {}
	for(const [id, status] of Object.entries(results.statuses)) {
		let points = 0;
		if (status == ticket.statusBets[id]) {
			if (status == STATUS.WHITE_WALKER) {
				points = SCORING.CORRECT_WW_STATUS;
			} else {
				points = SCORING.CORRECT_STATUS;
			}
		}
		statusHits[id] = points;
		total = total + points;
	}

	let questionHits = {}
	for(const[id, correctAnswer] of Object.entries(results.answers)) {
		let points = 0;
		if (correctAnswer == ticket.questionBets[id]) {
			if (id == QUESTION.PREGNANCY) {
				points = SCORING.PREGNANCY;
			} else if (id == QUESTION.NIGHT_KING_SLAYER) {
				points = SCORING.NIGHT_KING_SLAYER;
			} else if (id == QUESTION.THRONE_RULLER) {
				points = SCORING.THRONE_RULLER;
			}
		}
		questionHits[id] = points;
		total = total + points;
	}
	

	ticket.statusHits = statusHits;
	ticket.questionHits = questionHits;
	ticket.points = total;
	return ticket;
};
module.exports.calculatePoints = calculatePoints;

function calculatePointsList(tickets, results) {
	return tickets.map(ticket => calculatePoints(ticket, results));
};
module.exports.calculatePointsList = calculatePointsList;

module.exports.updatePointsOnAllTickets = async function(results) {
	let tickets = await dao.fetchAll();
	let promises = [];
	calculatePointsList(tickets, results).forEach(ticket => {
		promises.push(dao.update(ticket.id, ticket));
	});
	return Promise.all(promises);
}

// dohvata tikete sortirane po poenima
module.exports.fetchRanked = async function() {
	let tickets = await dao.fetchAllDTO();
	tickets.sort(function(a, b) {return b.points - a.points;});
	return tickets;
};