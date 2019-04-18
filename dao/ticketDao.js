let db = {};

function save(ticket) {
    db[ticket.id] = ticket;
}

function saveAll(tickets) {
    tickets.forEach(c => {save(c)});
}

function update(id, ticket) {
    ticket.id = id;
    db[id] = ticket;
}

function fetch(id) {
    return db[id];
}

function fetchAll() {
    return Object.values(db);
}

function remove(id) {
    delete db[id];
}

function removeAll() {
    db = {};
}

module.exports.save = save;
module.exports.update = update;
module.exports.saveAll = saveAll;
module.exports.fetch = fetch;
module.exports.fetchAll = fetchAll;
module.exports.remove = remove;
module.exports.removeAll = removeAll;