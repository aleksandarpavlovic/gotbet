const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const ticketDao = require('../dao/ticketDao.js');
const characterDao = require('../dao/characterDao.js');
const quizAnswerDao = require('../dao/quizAnswerDao.js');
const QUESTION = require('../models/question.js');

router.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname+ '/../resources/static/ranks.html'));
});

router.get('/ranks', function(req, res) {
	res.sendFile(path.resolve(__dirname+ '/../resources/static/ranks.html'));
});

router.get('/characters', function(req, res) {
	res.sendFile(path.resolve(__dirname+ '/../resources/static/characters.html'));
});

router.get('/tickets/:id', function(req, res) {
	let ticketStatusRowTemplate = readFile(path.resolve(__dirname+ '/../resources/static/ticket-status-row.html'));
	let ticketQuizRowTemplate = readFile(path.resolve(__dirname+ '/../resources/static/ticket-quiz-row.html'));
	let ticketPageTemplate = readFile(path.resolve(__dirname+ '/../resources/static/ticket.html'));
	let ticket = Promise.resolve(ticketDao.fetch(req.params.id));
	let populatedTicketStatusRowsPage = Promise.all([ticketStatusRowTemplate, ticket])
	.then((values) => {
		return populateTicketStatusRowsPage(values[0], values[1]);
	});
	let populatedTicketQuizRowsPage = Promise.all([ticketQuizRowTemplate, ticket])
	.then((values) => {
		return populateTicketQuizRowsPage(values[0], values[1]);
	});

	Promise.all([ticketPageTemplate, populatedTicketStatusRowsPage, populatedTicketQuizRowsPage, ticket])
	.then((values) => {
		let templateContent = {};
		templateContent.statusTableRows = values[1];
		templateContent.quizTableRows = values[2];
		templateContent.totalPoints = values[3].points;
		templateContent.ticketName = values[3].name;
		return populateTemplate(values[0], templateContent);
	})
	.then((html) => {res.send(html);})
	.catch((err) => {console.log(err); res.send("503 Internal server error")});
});

function readFile(path) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path, "utf8", function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	});
}

function populateTicketStatusRowsPage(rowTemplate, ticket) {
	page = "";
	for (let characterId in ticket.statusBets) {
		templateContent = {};
		character = characterDao.fetch(characterId);
		templateContent.hitOrMiss = ticket.statusBets[characterId] === character.status ? "bethit" : "betmiss";
		templateContent.character = character.name;
		templateContent.prediction = ticket.statusBets[characterId];
		templateContent.actualStatus = character.status;
		templateContent.points = ticket.statusHits[characterId];
		page = page + populateTemplate(rowTemplate, templateContent);
	}
	return page;
}

function populateTicketQuizRowsPage(rowTemplate, ticket) {
	page = "";
	for (let questionId in ticket.questionBets) {
		templateContent = {};
		quizAnswer = quizAnswerDao.fetch(questionId);
		templateContent.hitOrMiss = ticket.questionBets[questionId] === quizAnswer.answer ? "bethit" : "betmiss";
		templateContent.question = questionSentence(questionId);
		templateContent.prediction = ticket.questionBets[questionId];
		templateContent.answer = quizAnswer.answer;
		templateContent.points = ticket.questionHits[questionId];
		page = page + populateTemplate(rowTemplate, templateContent);
	}
	return page;
}

function questionSentence(questionId) {
	if (questionId == QUESTION.PREGNANCY)
		return "Is Daenerys pregnant?"
	else if (questionId == QUESTION.NIGHT_KING_SLAYER)
		return "Who kills the Night King?"
	else if (questionId == QUESTION.THRONE_RULLER)
		return "Who holds the Iron Throne at the end?"
	else
		return "Invalid question";
}

function populateTemplate(template, content) {
	for (let key in content) {
		template = template.replace("{{" + key + "}}", content[key]);
	}
	return template;
}

//export this router
module.exports = router;