const updaterDao = require('../updaterDao.js');
const connection = require('./connection.js');

const collection = connection.get().db('got').collection('tickets');

function create(ticket) {
    return new Promise((resolve, reject) => {
        let t = setMongoId(ticket);
        collection.insertOne(t, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function createAll(tickets) {
    return new Promise((resolve, reject) => {
        let ts = tickets.map(e => setMongoId(e));
        collection.insertMany(ts, function(err, result) {
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

function fetchAllDTO() {
    return new Promise((resolve, reject) => {
        collection.find({}).toArray(function(err, result) {
            if (err) reject(err);
            let r = result.map(ticket => {
                let dto = {};
                dto.id = ticket.id;
                dto.name = ticket.name;
                dto.points = ticket.points;
                return dto;
            });
            resolve(r);
        })
    });
}

function update(id, ticket) {
    return new Promise((resolve, reject) => {
        collection.updateOne({_id: id}, {$set: {statusHits: ticket.statusHits, questionHits: ticket.questionHits, points: ticket.points}}, function(err, result) {
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

function setMongoId(ticket) {
    ticket._id = ticket.id;
    return ticket;
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