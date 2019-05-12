const updaterDao = require('../updaterDao.js');
const connection = require('./connection.js');

const collection = connection.get().db('got').collection('quizanswers');

function create(quizAnswer) {
    return new Promise((resolve, reject) => {
        let answer = setMongoId(quizAnswer);
        collection.insertOne(answer, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function createAll(quizAnswers) {
    return new Promise((resolve, reject) => {
        let answers = quizAnswers.map(e => setMongoId(e));
        collection.insertMany(answers, function(err, result) {
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

function update(id, answer) {
    return new Promise((resolve, reject) => {
        collection.updateOne({_id: id}, {$set: {answer: answer}}, function(err, result) {
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

function setMongoId(answer) {
    answer._id = answer.questionId;
    return answer;
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