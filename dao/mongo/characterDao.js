const updaterDao = require('../updaterDao.js');
const connection = require('./connection.js');

const collection = connection.get().db('got').collection('characters');

function create(character) {
    return new Promise((resolve, reject) => {
        let c = setMongoId(character);
        collection.insertOne(c, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function createAll(characters) {
    return new Promise((resolve, reject) => {
        let chars = characters.map(e => setMongoId(e));
        collection.insertMany(chars, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function fetch(id) {
    return new Promise((resolve, reject) => {
        collection.findOne({_id: id}, function(err, result) {
            if (err) reject(err);
            resolve(result);
        })
    });
}

function fetchAll() {
    return new Promise((resolve, reject) => {
        collection.find({}).toArray(function(err, result) {
            if (err) reject(err);
            resolve(result);
        })
    });
}

function fetchAllIds() {
    return new Promise((resolve, reject) => {
        collection.find({}, {projection: {_id:1}}).toArray(function(err, result) {
            if (err) reject(err);
            let r = result.map(e => e._id);
            resolve(r);
        })
    });
}

function updateStatus(id, status) {
    return new Promise((resolve, reject) => {
        collection.updateOne({_id: id}, {$set: {status: status}}, function(err, result) {
            if (err) throw err;
            updateTimestamp();
            resolve();
        });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        collection.deleteOne({_id: id}, function(err, result) {
            if (err) reject(err);
            updateTimestamp();
            resolve();
        })
    });
}

function removeAll() {
    return new Promise((resolve, reject) => {
        collection.deleteMany({}, function(err, result) {
            if (err) reject(err);
            updateTimestamp();
            resolve();
        })
    });
}

function updateTimestamp() {
    updaterDao.updateTimestamp();
}

function getUpdateTimestamp() {
    return updaterDao.getUpdateTimestamp();
}

function setMongoId(character) {
    character._id = character.id;
    return character;
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