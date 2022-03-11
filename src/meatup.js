'use strict';

// load libraries
const router = require('koa-router')();
const db = require('./db');
const util = require('./cookie-utils.js');

// GET /api/meatup/:id
// get specific meatup
router.get('/:id', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        const {meatupRows} = await db.query('select * from meatup where id = $1', [ctx.params.id]);

        // TODO: combine queries into 1 result
        const {interestedRows} = await db.query('select * from interested where meatup_id = $1', [ctx.params.id]);

        // ensure it's not empty
        if(rows.length > 0){
            ctx.response.status = 200;
            ctx.response.body = rows;
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 400;
    }
});

// POST /api/meatup/list
// list meatups in lat/long range
router.post('/list', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        var requestBody;

        // TODO: finish off query
        const {rows} = await db.query('select * from meatup where latitude >= $1 and latitude <= $2 and longitude >= $3 and longitude <= $4', [requestBody]);

        // ensure it's not empty
        if(rows.length > 0){
            ctx.response.status = 200;
            ctx.response.body = rows;
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 400;
    }
});

// POST /api/meatup
// create a new meatup
router.post('/', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        var requestBody;

        // TODO: finish off query
        const result = await db.query('insert into meatup(title, description, datetime_start, datetime_end, latitude, longitude, owner) values ($1, $2, $3, $4, $5, $6, $7)', []);
        ctx.response.status = 200;
    }else{
        ctx.response.status = 400;
    }
});

// PATCH /api/meatup/:id
// update meatup details
router.patch('/:id', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        var requestBody;

        // TODO: finish off query
        const result = await db.query('update meatup set title = $1, description = $2, datetime_start = $3, datetime_end = $4, latitude = $5, longitude = $6 where id = $7', []);
        ctx.response.status = 200;
    }else{
        ctx.response.status = 400;
    }
});

// DELET /api/meatup/:id
// delete a meatup
router.delete('/:id', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        const result = await db.query('delete from meatup where id = $1', [ctx.params.id]);
        ctx.response.status = 200;
    }else{
        ctx.response.status = 400;
    }
});

module.exports = router;
