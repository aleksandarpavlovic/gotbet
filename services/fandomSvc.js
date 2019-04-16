const axios = require('axios');

function fetchPages(ids) {
	let joinedIds = ids.join('|');
	return axios.get(`https://gameofthrones.fandom.com/api.php?action=query&prop=revisions&pageids=${joinedIds}&rvprop=content&format=json`);
};

function extractStatuses(response) {
	let statuses = {};
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
	let regexMatch = pageContent.match(/Status\s?=\s?\[\[.*?\|(\w+)\]\]/);
	if (regexMatch)
		return regexMatch[1];
	else
		return "No status";
	
}

// module.exports.fetchStatuses = function(ids) {
// 	return fetchPages(ids)
// 	.then(extractStatuses);
// };

// mocking return values, because of fis blocking policy
module.exports.fetchStatuses = function(ids) {
	let statuses = {"123": "Deceased", "234": "Alive", "345": "Alive", "456": "Deceased"};
	return Promise.resolve(statuses);
}