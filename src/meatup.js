'use strict';

// load libraries
const router = require('koa-router')();
const db = require('./db');

// GET /api/meatup/:id
// get specific meatup
router.get('/:id', async (ctx, next) => {
    const {rows} = await db.query('select * from meatup where id = $1', [ctx.params.id]);

    // ensure it's not empty
    if(rows.length > 0){
        ctx.response.status = 200;
        ctx.response.body = rows;
    }else{
        ctx.response.status = 404;
    }
});

// GET /api/meatup/:id/interested
// get list of users interested in meatup
router.get('/:id/interested', async (ctx, next) => {
    const {rows} = await db.query('select * from meatup where id = $1', [ctx.params.id]);

    // ensure it's not empty
    if(rows.length > 0){
        ctx.response.status = 200;
        ctx.response.body = rows;
    }else{
        ctx.response.status = 404;
    }
});

// POST /api/meatup/list
// list meatups in lat/long range
router.post('/list', async (ctx, next) => {
    var requestBody;
    const {rows} = await db.query('select * from meatup where latitude >= $1 and latitude <= $2 and longitude >= $3 and longitude <= $4', [requestBody]);

    // ensure it's not empty
    if(rows.length > 0){
        ctx.response.status = 200;
        ctx.response.body = rows;
    }else{
        ctx.response.status = 404;
    }
});

// POST /api/meatup
// create a new meatup
router.post('/', async (ctx, next) => {
    var requestBody;
});

// PATCH /api/meatup/:id
// update meatup details
router.patch('/:id', async (ctx, next) => {
    var requestBody;
});

// DELET /api/meatup/:id
// delete a meatup
router.delete('/:id', async (ctx, next) => {
    var requestBody;
});

module.exports = router;
