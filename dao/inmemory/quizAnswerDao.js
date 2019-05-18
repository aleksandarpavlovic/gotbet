const updaterDao = require('../updaterDao.js');

let db = {};

function create(quizAnswer) {
    db[quizAnswer.questionId] = quizAnswer;
    return Promise.resolve();
}

function createAll(quizAnswers) {
    quizAnswers.forEach(c => {create(c)});
    return Promise.resolve();
}

function fetch(id) {
    return Promise.resolve(db[id]);
}

function fetchAll() {
    return Promise.resolve(Object.values(db));
}

function fetchAllIds() {
    return Promise.resolve(Object.keys(db));
}

function update(id, answer) {
    if (db[id]) {
        db[id].answer = answer;
    }
    updaterDao.updateTimestamp();
    return Promise.resolve();
}

function remove(id) {
    delete db[id];
    updaterDao.updateTimestamp();
    return Promise.resolve();
}

function removeAll() {
    db = {};
    updaterDao.updateTimestamp();
    return Promise.resolve();
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