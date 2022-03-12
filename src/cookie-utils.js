'use strict';

const db = require('./db');

const COOKIE_NAME = 'account_id';
const SESSION_AGE = 7889400000;
const DOMAIN_ADDRESS = process.env.DOMAIN_NAME;

module.exports = {
    set: (ctx, id) => {
        return ctx.cookies.set(COOKIE_NAME, id, {maxAge: SESSION_AGE, domain: DOMAIN_ADDRESS, overwrite: true});
    },
    verify: async (ctx) => {
        const user_id = ctx.cookies.get(COOKIE_NAME);
        const result = await db.query('select * from users where id = $1', [user_id]);
        return (result.rowCount > 0) ? user_id : undefined;
    }
}
