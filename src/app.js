'use strict';

// load libraries
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const helmet = require('koa-helmet');
const db = require('./db');

// create objects
const app = new Koa();
const router = new Router();

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
    // necessary for reading POST request body
    .use(koaBody())
    // free added security from koa-helmet
    .use(helmet())
    // add all defined routes in this file from koa-router
    .use(router.routes())
    .use(router.allowedMethods());

// export this object for use in main.js
module.exports = app;
