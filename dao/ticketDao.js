db = {};

function save(ticket) {
    db[ticket.id] = ticket;
}

function saveAll(tickets) {
    tickets.forEach(c => {save(c)});
}

function fetch(id) {
    return db[id];
}

function fetchAll() {
    return Object.values(db);
}

module.exports.save = save;
module.exports.saveAll = saveAll;
module.exports.fetch = fetch;
module.exports.fetchAll = fetchAll;