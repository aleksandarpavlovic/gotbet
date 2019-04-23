let lastUpdateTimestamp = 0;

function updateTimestamp() {
    lastUpdateTimestamp = Date.now();
}

function getUpdateTimestamp() {
    return lastUpdateTimestamp;
}

module.exports.updateTimestamp = updateTimestamp;
module.exports.getUpdateTimestamp = getUpdateTimestamp;