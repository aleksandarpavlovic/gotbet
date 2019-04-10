const axios = require('axios');

function fetchPages(ids) {
	let idsCommaSeparated = ids.join('|');
	return axios.get(`https://gameofthrones.fandom.com/api.php?action=query&prop=revisions&pageids=${idsCommaSeparated}&rvprop=content&format=json`);
};

function extractStatuses(response) {
	statuses = {};
	if (response.data && response.data.query && response.data.query.pages) {
		const entries = Object.entries(response.data.query.pages);
		for (const [id, page] of entries) {
			if (page.revisions && page.revisions[0] && page.revisions[0]["*"]) {
				statuses[id] = extractStatus(page.revisions[0]["*"]);
				console.log(page.title + "-" + id + " : " + statuses[id]);
			}
		}
	}
	return statuses;
};

function extractStatus(pageContent) {
	regexMatch = pageContent.match(/Status\s?=\s?\[\[.*?\|(\w+)\]\]/);
	if (regexMatch)
		return regexMatch[1];
	else
		return "No status";
	
}

module.exports.fetchStatuses = function(ids) {
	return fetchPages(ids)
	.then(extractStatuses);
};