const EventEmitter = require('events').EventEmitter;

const updaterTopic = new EventEmitter();
const charactersTopic = new EventEmitter();
const ticketsTopic = new EventEmitter();

updaterTopic.setMaxListeners(1);
charactersTopic.setMaxListeners(50);
ticketsTopic.setMaxListeners(50);

module.exports.updaterTopic = updaterTopic;
module.exports.charactersTopic = charactersTopic;
module.exports.ticketsTopic = ticketsTopic;