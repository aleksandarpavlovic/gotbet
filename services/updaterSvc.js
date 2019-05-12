const appConf = require('../conf/appConf.js');
const fandomSvc = require('./fandomSvc.js');
const characterSvc = require('./characterSvc.js');
const ticketSvc = require('./ticketSvc.js');
const bus = require('./bus.js');
const dao = require('../dao/updaterDao.js');
const characterDao = require(`../dao/${appConf.DAO_IMPL}/characterDao.js`);
const quizAnswerDao = require(`../dao/${appConf.DAO_IMPL}/quizAnswerDao.js`);

class UpdaterService {
    constructor() {
        this.isUpdatingScheduled = false;
    }

    // so confused with reference to this in js, so had to go with a single fat method instead of multiple smaller ones

    // delay(sleepTime) {
    //     return new Promise(function(resolve) {
    //         setTimeout(function() {
    //             resolve('success');
    //         },sleepTime);
    //     });
    // }

    // scheduleUpdate(sleepTime) {
    //     console.log('scheduled status update');
    //     this.isUpdatingScheduled = true;
        
    //     new Promise(function(resolve) {
    //         setTimeout(function() {
    //             resolve('success');
    //         },sleepTime);
    //     })
    //     .then(characterDao.fetchAllIds())
    //     .then(fandomSvc.fetchStatuses)
    //     .then(characterSvc.updateStatuses)
    //     .then(function() {
    //         let statuses = {};
    //         characterDao.fetchAll().forEach(character => statuses[character.id] = character.status);
    //         let answers = {};
    //         quizAnswerDao.fetchAll().forEach(quizAnswer => answers[quizAnswer.id] = quizAnswer.answer);
    //         let ret = {};
    //         ret.statuses = statuses; ret.answers = answers;
    //         return ret;
    //     })
    //     .then(ticketSvc.updatePointsOnAllTickets)
    //     .then(function() {
    //         bus.charactersTopic.emit('notify');
    //         bus.ticketsTopic.emit('notify');
    //     })
    //     .catch(function(err) {
    //         console.log('updaterSvc error - ${err}');
    //     })
    //     .finally(function() {
    //         this.isUpdatingScheduled = false;
    //     });
    // }

    async onClientRequest(requestTimestamp) {
        if (!this.isUpdatingScheduled && requestTimestamp > dao.getUpdateTimestamp()) {
            let sleepTime = 0;
            if (requestTimestamp - dao.getUpdateTimestamp() < appConf.FANDOM_REFRESH_INTERVAL) {
                sleepTime = appConf.FANDOM_REFRESH_INTERVAL - (requestTimestamp - dao.getUpdateTimestamp());               
            }
            
            console.log('scheduled status update in ' + sleepTime/1000 + ' seconds');
            this.isUpdatingScheduled = true;
            
            try {
                await timeout(sleepTime);
                let fandomStatuses = await fandomSvc.fetchStatuses(await characterDao.fetchAllIds());
                await characterSvc.updateStatuses(fandomStatuses);
                
                let updateData = {};
                updateData.statuses = {};
                updateData.answers = {};
                let characters = await characterDao.fetchAll();
                let quizAnswers = await quizAnswerDao.fetchAll();
                characters.forEach(c => updateData.statuses[c.id] = c.status);
                quizAnswers.forEach(a => updateData.answers[a.questionId] = a.answer);            
                await ticketSvc.updatePointsOnAllTickets(updateData);
                
                bus.charactersTopic.emit('notify');
                bus.ticketsTopic.emit('notify');
            } catch (err) {
                console.log('updaterSvc error - ' + err);
            } finally {
                this.isUpdatingScheduled = false;
                console.log('status update performed');
            }
        } else {
            console.log('skipped update scheduling')
        }
    }       
}

function timeout(sleepTime) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        },sleepTime);
    });
}

module.exports = UpdaterService;