const updaterDao = require('../updaterDao.js');

let db = {};

function create(character) {
    db[character.id] = character;
    return Promise.resolve();
}

function createAll(characters) {
    characters.forEach(c => {create(c)});
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

function updateStatus(id, status) {
    if (db[id]) {
        db[id].status = status;
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
module.exports.updateStatus = updateStatus;
module.exports.remove = remove;
module.exports.removeAll = removeAll;