let db = {};

function save(character) {
    db[character.id] = character;
}

function saveAll(characters) {
    characters.forEach(c => {save(c)});
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
    if (db[id])
        db[id].status = status;
}

function remove(id) {
    delete db[id];
}

function removeAll() {
    db = {};
}

module.exports.save = save;
module.exports.saveAll = saveAll;
module.exports.fetch = fetch;
module.exports.fetchAll = fetchAll;
module.exports.fetchAllIds = fetchAllIds;
module.exports.updateStatus = updateStatus;
module.exports.remove = remove;
module.exports.removeAll = removeAll;