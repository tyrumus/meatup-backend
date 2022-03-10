// load library real pg library. all other JS files should require() this one.
const { Pool } = require('pg');

// configure new connection pool
const pool = new Pool({
    user: 'postgres',
    // this field can also be an IP address. p2s-psql only exists in the Docker network generated at runtime via build.sh
    host: 'p2s-psql',
    database: 'postgres',
    // TODO: configure build script to pass secrets from production environment before deploying this code to web server
    password: '1234',
    port: 5432
});

module.exports = {
    // expose db.query(text, parameters, callback) as a public function
    // can be awaited for easy asynchronous code
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
}
