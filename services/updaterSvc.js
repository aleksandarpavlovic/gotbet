const fandomSvc = require('./fandomSvc.js');
const characterSvc = require('./characterSvc.js');
const ticketSvc = require('./ticketSvc.js');
const bus = require('./bus.js');
const dao = require('../dao/updaterDao.js');
const characterDao = require('../dao/characterDao.js');
const quizAnswerDao = require('../dao/quizAnswerDao.js');
const appCommon = require('../common/appCommon.js');

module.exports.onClientRequest = function(timestamp) {
    if (timestamp - dao.getUpdateTimestamp() >= appCommon.REFRESH_INTERVAL) {
        console.log('osvezavanje statusa');
        Promise.resolve(characterDao.fetchAllIds())
	    .then(fandomSvc.fetchStatuses)
        .then(characterSvc.updateStatuses)
        .then(function() {
            let statuses = {};
            characterDao.fetchAll().forEach(character => statuses[character.id] = character.status);
            let answers = {};
            quizAnswerDao.fetchAll().forEach(quizAnswer => answers[quizAnswer.id] = quizAnswer.answer);
            let ret = {};
            ret.statuses = statuses; ret.answers = answers;
            return ret;
        })
        .then(ticketSvc.updatePointsOnAllTickets)
        .then(function(){
            bus.charactersTopic.emit('notify');
            bus.ticketsTopic.emit('notify');
        });
        
    }
};