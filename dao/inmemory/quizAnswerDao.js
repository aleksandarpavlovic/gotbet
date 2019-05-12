const updaterDao = require('../updaterDao.js');

let db = {};

function create(quizAnswer) {
    db[quizAnswer.questionId] = quizAnswer;
}

function createAll(quizAnswers) {
    quizAnswers.forEach(c => {create(c)});
}

function fetch(id) {
    return db[id];
}

function fetchAll() {
    return Object.values(db);
}

function fetchAllIds() {
    return Object.keys(db);
}

function update(id, answer) {
    if (db[id]) {
        db[id].answer = answer;
    }
    updaterDao.updateTimestamp();
}

function remove(id) {
    delete db[id];
    updaterDao.updateTimestamp();
}

function removeAll() {
    db = {};
    updaterDao.updateTimestamp();
}

function updateTimestamp() {
    updaterDao.updateTimestamp();
}

function getUpdateTimestamp() {
    return updaterDao.getUpdateTimestamp();
}

module.exports.updateTimestamp = updateTimestamp;
module.exports.getUpdateTimestamp = getUpdateTimestamp;
module.exports.create = create;
module.exports.createAll = createAll;
module.exports.fetch = fetch;
module.exports.fetchAll = fetchAll;
module.exports.fetchAllIds = fetchAllIds;
module.exports.update = update;
module.exports.remove = remove;
module.exports.removeAll = removeAll;