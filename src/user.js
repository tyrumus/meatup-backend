'use strict';

// load libraries
const router = require('koa-router')();
const db = require('./db');

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
    // TODO: actually create a new user
    var requestBody = ctx.request.body;
    if(requestBody){
        if(typeof requestBody == 'string'){
            requestBody = JSON.parse(requestBody);
        }
        if('name' in requestBody){
            // TODO: finish this line
            await db.query('insert into users(display_name
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 400;
    }
});

module.exports = router;
