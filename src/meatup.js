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
        const meatupResult = await db.query('select * from meatup where id = $1', [ctx.params.id]);
        if(meatupResult.rowCount > 0){
            const interestedResult = await db.query('select user_id from interested where meatup_id = $1', [ctx.params.id]);
            var interested = [];
            for(var i = 0; i < interestedResult.rowCount; i++){
                interested.push(interestedResult.rows[i].user_id);
            }

            var meatupData = meatupResult.rows[0];
            meatupData.interested = interested;
            ctx.response.status = 200;
            ctx.response.body = meatupData;
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 400;
    }
});

// POST /api/meatup/:id/interested
// add user to list of interested users for meatup
router.post('/:id/interested', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        const result = await db.query('insert into interested(user_id, meatup_id) values ($1, $2)', [userID, ctx.params.id]);
        if(result.rowCount > 0){
            ctx.response.status = 200;
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 400;
    }
});

// DELETE /api/meatup/:id/interested
// remove user from list of interested users for meatup
router.delete('/:id/interested', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        const result = await db.query('delete from interested where user_id = $1 and meatup_id = $2', [userID, ctx.params.id]);
        if(result.rowCount > 0){
            ctx.response.status = 200;
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
        var requestBody = ctx.request.body;
        if(requestBody){
            if(typeof requestBody == 'string'){
                requestBody = JSON.parse(requestBody);
            }
            const meatupKeys = [
                'latitude_low',
                'latitude_high',
                'longitude_low',
                'longitude_high'
            ];
            if(meatupKeys.every(function(o){return o in requestBody;})){
                // TODO: return owner's display name in addition to uuid (left outer join)
                const result = await db.query('select id,title,description,datetime_start,owner from meatup where latitude >= $1 and latitude <= $2 and longitude >= $3 and longitude <= $4', [requestBody.latitude_low, requestBody.latitude_high, requestBody.longitude_low, requestBody.longitude_high]);
                if(result.rowCount > 0){
                    ctx.response.status = 200;
                    ctx.response.body = result.rows;
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
        ctx.response.status = 400;
    }
});

// POST /api/meatup
// create a new meatup
// TODO: support image upload
router.post('/', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        var requestBody = ctx.request.body;
        if(requestBody){
            if(typeof requestBody == 'string'){
                requestBody = JSON.parse(requestBody);
            }
            const meatupKeys = [
                'title',
                'description',
                'datetime_start',
                'datetime_end',
                'latitude',
                'longitude'
            ];
            if(meatupKeys.every(function(o){return o in requestBody;})){
                const result = await db.query('insert into meatup(' + meatupKeys.toString() + ', owner) values ($1, $2, to_timestamp($3), to_timestamp($4), $5, $6, $7) returning id', [requestBody.title, requestBody.description, requestBody.datetime_start, requestBody.datetime_end, requestBody.latitude, requestBody.longitude, userID]);
                if(result.rowCount > 0){
                    ctx.response.status = 200;
                    ctx.response.body = result.rows[0];
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
        ctx.response.status = 400;
    }
});

// PATCH /api/meatup/:id
// update meatup details
router.patch('/:id', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        var requestBody = ctx.request.body;
        if(requestBody){
            if(typeof requestBody == 'string'){
                requestBody = JSON.parse(requestBody);
            }
            const meatupKeys = [
                'title',
                'description',
                'datetime_start',
                'datetime_end',
                'latitude',
                'longitude'
            ];
            if(meatupKeys.every(function(o){return o in requestBody;})){
                const result = await db.query('update meatup set title = $1, description = $2, datetime_start = to_timestamp($3), datetime_end = to_timestamp($4), latitude = $5, longitude = $6 where id = $7', [requestBody.title, requestBody.description, requestBody.datetime_start, requestBody.datetime_end, requestBody.latitude, requestBody.longitude, ctx.params.id]);
                if(result.rowCount > 0){
                    ctx.response.status = 200;
                }else{
                    console.log("error 1");
                    ctx.response.status = 400;
                }
            }else{
                console.log("error 2");
                ctx.response.status = 400;
            }
        }else{
            console.log("error 3");
            ctx.response.status = 400;
        }
    }else{
        console.log("error 4");
        ctx.response.status = 400;
    }
});

// DELETE /api/meatup/:id
// delete a meatup
router.delete('/:id', async (ctx, next) => {
    const userID = await util.verify(ctx);
    if(userID){
        const result = await db.query('delete from meatup where id = $1', [ctx.params.id]);
        if(result.rowCount > 0){
            ctx.response.status = 200;
        }else{
            ctx.response.status = 400;
        }
    }else{
        ctx.response.status = 400;
    }
});

module.exports = router;
