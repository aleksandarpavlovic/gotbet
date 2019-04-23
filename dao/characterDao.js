const updaterDao = require('./updaterDao.js');

let db = {};

function create(character) {
    db[character.id] = character;
}

function createAll(characters) {
    characters.forEach(c => {create(c)});
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

function updateStatus(id, status) {
    if (db[id]) {
        db[id].status = status;
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
module.exports.updateStatus = updateStatus;
module.exports.remove = remove;
module.exports.removeAll = removeAll;