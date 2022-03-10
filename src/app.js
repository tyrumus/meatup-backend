'use strict';

// load libraries
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const helmet = require('koa-helmet');
const db = require('./db');
const session = require('koa-session');

// create objects
const app = new Koa();
const router = new Router();

// koa-session setup
app.keys = ['sessionsecretgoeshere'];

// TODO: rewrite these functions. they no worky with current layout
const sessionStore = {
    async get(key){
        const {rows} = await db.query('select * from sessions where id = $1', [key]);
        if(rows.length == 1){
            return rows[0].data;
        }else{
            return null;
        }
    },
    async set(key, session){
        // check if session already exists in database
        const {rows} = await db.query('select * from sessions where id = $1', [key]);
        if(rows.length == 1){
            await db.query('update sessions set data = $1 where id = $2', [session, key]);
        }else{
            await db.query('insert into sessions (data, id) values ($1, $2)', [session, key]);
        }
    },
    async destroy(key){
        await db.query('delete from sessions where id = $1', [key]);
        await db.query('delete from cart where session_id = $1', [key]);
    }
};

const SESSION_CONFIG = {
    maxAge: 31557600,
    store: sessionStore
};

// check if everything is configured properly
router.get('/api/backend-endpoint', (ctx, next) => {
    ctx.response.status = 200;
    ctx.body = 'hello from koa-router. This is from the nodejs backend.';
});


const routeList = [
    {
        prefix: '/api/meatup',
        route: require('./meatup.js')
    },
    {
        prefix: '/api/user',
        route: require('./user.js')
    }
];

for(var r of routeList){
    router.use(r.prefix, r.route.routes(), r.route.allowedMethods());
}

// add the following to the web app
app
    // use koa-session
    .use(session(SESSION_CONFIG, app))
    // necessary for reading POST request body
    .use(koaBody())
    // free added security from koa-helmet
    .use(helmet())
    // add all defined routes in this file from koa-router
    .use(router.routes())
    .use(router.allowedMethods());

// export this object for use in main.js
module.exports = app;
