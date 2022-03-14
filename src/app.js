'use strict';

// load libraries
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const mount = require('koa-mount');
const helmet = require('koa-helmet');
const db = require('./db');
const fs = require('fs');
const path = require('path');

// create objects
const app = new Koa();
const router = new Router();

// check if everything is configured properly
router.get('/backend-endpoint', (ctx, next) => {
    ctx.response.status = 200;
    ctx.body = 'hello from koa-router. This is from the nodejs backend.';
});

const cdnFolders = ['/cdn/tmp', '/cdn/public'];
for(var i = 0; i < cdnFolders.length; i++){
    const f = cdnFolders[i];
    fs.access(f, (error) => {
        if(error){
            fs.mkdir(f, (error) => {});
        }
    });
}

// force delete files on upload
router.all('/(.*)', async (ctx, next) => {
    await next();
    if(ctx.request.files){
        try {
            fs.readdir('/cdn/tmp', (err, files) => {
                if (err) throw err;

                for (const file of files){
                    fs.unlink(path.join('/cdn/tmp', file), err => {
                        if(err) throw err;
                    });
                }
            });
        } catch (err) {
            console.log('error clearing /cdn/tmp: ' + err.message);
        }
    }
});

const routeList = [
    {
        prefix: '/meatup',
        route: require('./meatup.js')
    },
    {
        prefix: '/user',
        route: require('./user.js')
    }
];

for(var r of routeList){
    router.use(r.prefix, r.route.routes(), r.route.allowedMethods());
}

// add the following to the web app
app
    // necessary for reading POST request body
    .use(koaBody({multipart: true, formidable: {uploadDir: '/cdn/tmp'}}))
    // free added security from koa-helmet
    .use(helmet())
    .use(mount('/cdn', koaStatic('/cdn/public')))
    // add all defined routes in this file from koa-router
    .use(mount('/api', router.routes()))
    .use(router.allowedMethods());

// export this object for use in main.js
module.exports = app;
