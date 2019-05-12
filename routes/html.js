const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const appConf = require('../conf/appConf.js');
const ticketDao = require(`../dao/${appConf.DAO_IMPL}/ticketDao.js`);
const characterDao = require(`../dao/${appConf.DAO_IMPL}/characterDao.js`);
const quizAnswerDao = require(`../dao/${appConf.DAO_IMPL}/quizAnswerDao.js`);
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

router.get('/tickets/:id', async function(req, res) {
	try {
		let ticketStatusRowTemplate = readFile(path.resolve(__dirname+ '/../resources/static/ticket-status-row.html'));
		let ticketQuizRowTemplate = readFile(path.resolve(__dirname+ '/../resources/static/ticket-quiz-row.html'));
		let ticketPageTemplate = readFile(path.resolve(__dirname+ '/../resources/static/ticket.html'));

		let ticket = await ticketDao.fetch(req.params.id);
		let fillStatuses = populateTicketStatusRowsPage(await ticketStatusRowTemplate, ticket);
		let fillQuiz = populateTicketQuizRowsPage(await ticketQuizRowTemplate, ticket);

		let templateContent = {};
		templateContent.statusTableRows = await fillStatuses;
		templateContent.quizTableRows = await fillQuiz;
		templateContent.totalPoints = ticket.points ? ticket.points : "-";
		templateContent.ticketName = ticket.name;
		let html = populateTemplate(await ticketPageTemplate, templateContent);
		res.send(html);
	} catch(err) {
		res.send("503 Internal server error");
	}
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

async function populateTicketStatusRowsPage(rowTemplate, ticket) {
	let page = "";
	// optimization: fetching all instead one by one
	let characters = await characterDao.fetchAll();
	for (let characterId in ticket.statusBets) {
		let templateContent = {};
		let character = characters.find(e => e.id == characterId);
		templateContent.hitOrMiss = ticket.statusBets[characterId] === character.status ? "bethit" : "betmiss";
		templateContent.character = character.name;
		templateContent.prediction = ticket.statusBets[characterId];
		templateContent.actualStatus = character.status;
		templateContent.points = ticket.statusHits ? ticket.statusHits[characterId] : "-";
		page = page + populateTemplate(rowTemplate, templateContent);
	}
	return page;
}

async function populateTicketQuizRowsPage(rowTemplate, ticket) {
	let page = "";
	for (let questionId in ticket.questionBets) {
		let templateContent = {};
		let quizAnswer = await quizAnswerDao.fetch(questionId);
		templateContent.hitOrMiss = ticket.questionBets[questionId] === quizAnswer.answer ? "bethit" : "betmiss";
		templateContent.question = questionSentence(questionId);
		templateContent.prediction = ticket.questionBets[questionId];
		templateContent.answer = quizAnswer.answer;
		templateContent.points = ticket.questionHits ? ticket.questionHits[questionId] : "-";
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