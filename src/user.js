'use strict';

// load libraries
const router = require('koa-router')();
const db = require('./db');

const GLOBAL_API_KEY = process.env.API_KEY;

// GET /api/user/:id
// gets user details + interested meatups
router.get('/:id', async (ctx, next) => {
    const {userRows} = await db.query('select * from users where id = $1', [ctx.params.id]);
    // TODO: get interested meatups
    const {meatupRows} = await db.query('select meatup_id from interested where user_id = $1', [ctx.params.id]);
    // TODO: assemble data in JSON object
    const userData = {
        userRows[0],
        interested_meatups: meatupRows
    };

    // ensure it's not empty
    if(rows.length > 0){
        ctx.response.status = 200;
        ctx.response.body = userData;
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
