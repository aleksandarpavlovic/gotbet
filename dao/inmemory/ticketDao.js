const updaterDao = require('../updaterDao.js');

let db = {};

function create(ticket) {
    db[ticket.id] = ticket;
}

function createAll(tickets) {
    tickets.forEach(c => {create(c)});
}

function update(id, ticket) {
    ticket.id = id;
    db[id] = ticket;
    updaterDao.updateTimestamp();
}

function fetch(id) {
    return db[id];
}

function fetchAll() {
    return Object.values(db);
}

function fetchAllDTO() {
    return Object.values(db).map(function(ticket) {
        let dto = {};
        dto.id = ticket.id;
        dto.name = ticket.name;
        dto.points = ticket.points;
        return dto;
    });
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
module.exports.update = update;
module.exports.createAll = createAll;
module.exports.fetch = fetch;
module.exports.fetchAll = fetchAll;
module.exports.fetchAllDTO = fetchAllDTO;
module.exports.remove = remove;
module.exports.removeAll = removeAll;