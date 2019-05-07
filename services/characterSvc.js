const dao = require('../dao/characterDao.js');

module.exports.updateStatuses = function(statuses) {
	for (const [id, status] of Object.entries(statuses)) {
		dao.updateStatus(id, status);
	}
	dao.updateTimestamp();
}