const dao = require('../dao/ticketDao.js');

// racuna poene za ticket i vraca ticket
module.exports.calculatePoints(ticket) = function() {};

module.exports.calculatePointsList(tickets) = function() {};

// dohvata tikete sortirane po poenima
module.exports.fetchRanked() = function() {
	tickets = dao.fetchAll();
	tickets.sort(a, b => a.points > b.points);
	return tickets;
};