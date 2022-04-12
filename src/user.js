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
        const userInfo = await db.query('select display_name from users where id = $1', [userID]);
        const userInterests = await db.query('select interested.meatup_id,meatup.title,meatup.description,meatup.datetime_start from interested left outer join meatup on meatup.id = interested.meatup_id where interested.user_id = $1', [userID]);
        const ownedMeatups = await db.query('select * from meatup where owner = $1', [userID]);
        const userData = {
            name: userInfo.rows[0].display_name,
            interested_meatups: userInterests.rows,
            owned_meatups: ownedMeatups.rows
        };

        // ensure it's not empty
        if(userInfo.rowCount > 0){
            ctx.response.status = 200;
            ctx.response.body = userData;
        }else{
            ctx.response.status = 400;
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
                const {rows} = await db.query('insert into users(display_name) values($1) returning id', [requestBody.name]);
                util.set(ctx, rows[0].id);
                ctx.response.status = 200;
                ctx.response.body = {id: rows[0].id};
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

// PATCH /api/user
// update username for current authenticated user
router.patch('/', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        var requestBody = ctx.request.body;
        if(requestBody){
            if(typeof requestBody == 'string'){
                requestBody = JSON.parse(requestBody);
            }
            if('name' in requestBody){
                const result = await db.query('update users set display_name = $1 where id = $2', [requestBody.name, userID]);
                if(result.rowCount > 0){
                    ctx.response.status = 200;
                }else{
                    ctx.response.status = 400;
                }
            }else{
                ctx.response.status = 400;
            }
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 404;
    }
});

module.exports = router;
