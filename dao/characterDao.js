db = {};

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

function updateStatus(id, status) {
    if (db[id])
        db[id].status = status;
}

module.exports.save = save;
module.exports.saveAll = saveAll;
module.exports.fetch = fetch;
module.exports.fetchAll = fetchAll;
module.exports.updateStatus = updateStatus;