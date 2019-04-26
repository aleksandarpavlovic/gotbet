const axios = require('axios');
const STATUS = require('../models/status.js');

function fetchPages(ids) {
	if (ids) {
		let joinedIds = ids.join('|');
		return axios.get(`https://gameofthrones.fandom.com/api.php?action=query&prop=revisions&pageids=${joinedIds}&rvprop=content&format=json`);
	} else {
		return Promise.reject('No characters defined, cannot fetch statuses');
	}
};

function extractStatuses(response) {
	let statuses = {};
	if (response.data && response.data.query && response.data.query.pages) {
		const entries = Object.entries(response.data.query.pages);
		for (const [id, page] of entries) {
			if (page.revisions && page.revisions[0] && page.revisions[0]["*"]) {
				statuses[id] = extractStatus(page.revisions[0]["*"]);
				// console.log(page.title + "-" + id + " : " + statuses[id]);
			}
		}
	}
	return statuses;
};

function extractStatus(pageContent) {
	let statusMatch = pageContent.match(/\|\s?Status\s?=\s?\[\[.*?\|(\w+)\]\]/);
	let wightMatch = pageContent.match(/\|\s?Culture\s?=(.*?)\[\[Wight\]\]/);
	if (wightMatch && !wightMatch[1].includes("|")) {
		return STATUS.WHITE_WALKER;
	} else if (statusMatch) {
		return transformStatus(statusMatch[1]);
	} else {
		return STATUS.UNKNOWN;
	}
}

function transformStatus(rawStatus) {
	switch(rawStatus) {
		case "Alive":
			return STATUS.ALIVE;
		case "Deceased":
			return STATUS.DECEASED;
		default:
			return STATUS.UNKNOWN; 
	}
}

module.exports.fetchStatuses = function(ids) {
	return fetchPages(ids)
	.then(extractStatuses);
};
