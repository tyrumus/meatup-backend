'use strict';

// load libraries
const router = require('koa-router')();
const db = require('./db');
const util = require('./cookie-utils.js');

const GLOBAL_API_KEY = process.env.API_KEY;

// GET /api/user
// get own user's details + interested meatups + owned meatups
router.get('/', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        // TODO: if performance issues, consolidate queries
        const userInfo = await db.query('select * from users where id = $1', [userID]);
        // TODO: get interested meatups
        const userInterests = await db.query('select meatup_id from interested where user_id = $1', [userID]);
        // TODO: get owned meatups
        const ownedMeatups = await db.query('select * from meatup where owner = $1', [userID]);
        // TODO: assemble data in JSON object
        const userData = {
            userInfo.rows[0],
            interested_meatups: userInterests.rows,
            owned_meatups: ownedMeatups.rows
        };

        // ensure it's not empty
        if(rows.length > 0){
            ctx.response.status = 200;
            ctx.response.body = userData;
        }else{
            ctx.response.status = 404;
        }
    }else{
        ctx.response.status = 404;
    }
});

// POST /api/user
// create a new user
router.post('/', async (ctx, next) => {
    var requestBody = ctx.request.body;
    if(requestBody){
        if(typeof requestBody == 'string'){
            requestBody = JSON.parse(requestBody);
        }
        if(('key' in requestBody) && ('name' in requestBody)){
            if(requestBody.key === GLOBAL_API_KEY){
                // TODO: handle when insert query fails...though I'm not sure it ever would
                const {rows} = await db.query('insert into users(display_name) values($1) returning id', [requestBody.name]);
                util.set(ctx, rows[0].id);
                ctx.response.status = 200;
                ctx.response.body = {
                    id: rows[0].id,
                    name: requestBody.name
                };
            }else{
                ctx.response.status = 400;
            }
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 400;
    }
});

module.exports = router;
