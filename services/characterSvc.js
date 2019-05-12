const appConf = require('../conf/appConf.js');
const dao = require(`../dao/${appConf.DAO_IMPL}/characterDao.js`);

module.exports.updateStatuses = function(statuses) {
	let promises = [];
	for (const [id, status] of Object.entries(statuses)) {
		promises.push(dao.updateStatus(id, status));
	}
	return Promise.all(promises);
}