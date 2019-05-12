if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

const DEFAULT_PORT = 3000;
const DEFAULT_REFRESH_INTERVAL = 1 * 60 * 1000; // 1 minute
const DEFAULT_DAO_IMPL = 'inmemory';

console.log('Loading app configuration...');

let PORT = DEFAULT_PORT;
if (process.env.PORT) {
    PORT = process.env.PORT;
    console.log(`\tPORT set to ${PORT}`);
} else {
    console.log(`\tNo PORT configured. Defaulting to ${DEFAULT_PORT}`);
}

let FANDOM_REFRESH_INTERVAL = DEFAULT_REFRESH_INTERVAL;
if (process.env.FANDOM_REFRESH_INTERVAL) {
    FANDOM_REFRESH_INTERVAL = process.env.FANDOM_REFRESH_INTERVAL;
    console.log(`\tFANDOM_REFRESH_INTERVAL set to ${FANDOM_REFRESH_INTERVAL/1000} seconds`);
} else {
    console.log(`\tNo FANDOM_REFRESH_INTERVAL configured. Defaulting to ${DEFAULT_REFRESH_INTERVAL/1000} seconds`);
}

let DAO_IMPL = DEFAULT_DAO_IMPL;
if (process.env.DAO_IMPL) {
    DAO_IMPL = process.env.DAO_IMPL;
    console.log(`\tDAO_IMPL set to ${DAO_IMPL}`);
} else {
    console.log(`\tNo DAO_IMPL configured. Defaulting to ${DEFAULT_DAO_IMPL}`);
}

console.log('Completed loading of app configuration');

module.exports.PORT = PORT;
module.exports.FANDOM_REFRESH_INTERVAL = FANDOM_REFRESH_INTERVAL;
module.exports.DAO_IMPL = DAO_IMPL;