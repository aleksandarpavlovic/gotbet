const dao = require('../dao/ticketDao.js');
const STATUS = require('../models/status.js');
const QUESTION = require('../models/question.js/index.js');

const SCORING = {
	CORRECT_STATUS = 1,
	CORRECT_WW_STATUS = 2,
	PREGNANCY = 1,
	NIGHT_KING_SLAYER = 2,
	THRONE_RULLER = 3
};
// racuna poene za ticket i vraca ticket
module.exports.calculatePoints(ticket, results) = function() {
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
	for(const[id, correctAnswer] of Object.entries(results.questions)) {
		let points = 0;
		if (correctAnswer == ticket.questions[id]) {
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
};

module.exports.calculatePointsList(tickets, results) = function() {
	tickets.map(ticket => calculatePoints(ticket, results));
};

// dohvata tikete sortirane po poenima
module.exports.fetchRanked() = function() {
	let tickets = dao.fetchAll();
	tickets.sort(a, b => a.points - b.points);
	return tickets;
};