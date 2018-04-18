/**
 *  contract Example {
 *
 *      string _value;
 *
 *      // Constructor
 *      function Example(string value) {
 *          _value = value;
 *      }
 *  }
 */

Error.stackTraceLimit = Infinity;

const b24 = require('b24');
const cote = require('cote');
const express = require('express');
var app = express();
require('run-middleware')(app)
// server = require('http').Server(app),
// // io = require('socket.io')(server),
// io = require('socket.io').listen(app)

// const cote = require('cote'),
//     server = require('http').createServer(handler),
//     io = require('socket.io').listen(server),
//     fs = require('fs');


// A Responder that shall listen for the Rest Api calls
const responder = new cote.Responder({ name: ' bitrix rest calls API responder ' });

const userResponder = new cote.Responder({name: 'User Responder'});


// // A Publisher that shall notify for the Rest API calls
// const publisher = new cote.Publisher({ name: 'arbitration publisher' });

// const subscriber = new cote.Subscriber({ name: 'arbitration subscriber' });

// B24 setup
const bitrix24 = new b24.Bitrix24({
    config: {
        mode: "api",
        host: "your bitrix host",
        client_id : "your client id",
        client_secret : "your client secret",
        redirect_uri : "http://localhost:3000/callback"
    },
    methods: {
        async saveToken(data){
            //Save token to database
        },
        async retriveToken(){
            //Retrive token from database
            return {
                access_token: "youraccesstoken",
                refresh_token: "yourrefreshtoken"
            }
        }
    }
})

const oauth2 = require('simple-oauth2').create(credentials);

// Authorization oauth2 URI
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: '<scope>', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
  state: '<state>'
});

userResponder.on('api2', (req) => app.runMiddleware(req.path, {}, function(code, data, headers) {
    console.log(code) // 301
    console.log(headers.location) // bitrix24.auth.authorization_uri
}));


// Bitrix auth
app.get('/auth', function(req, res, next) {

    console.log(`requested end-user interface`);

    // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
    res.redirect(authorizationUri);

    console.log(`requested redirect`, bitrix24.auth.authorization_uri);

    console.log(`requested result`);

    console.log('Request URL:', req.originalUrl)

    // res.sendFile(__dirname + '/index.html');
    // if the user ID is 0, skip to the next route
    if (req.statusCode === 304) next('route')
    // otherwise pass the control to the next middleware function in this stack
    else next()

}, function (req, res, next) {
    
    // Get the access token object (the authorization code is given from the previous step).
    const tokenConfig = {
        code: req,
        redirect_uri: 'http://localhost:3000/callback',
        scope: '<scope>', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
    };
    console.log('Request Type:', req.method)
    next()

}, async function (req, res, next) {

    console.log('Request Type:', req.method)

    console.log(`requested callback`);

    // Save the access token
    try {
        const result = await oauth2.authorizationCode.getToken(tokenConfig)
        const accessToken = oauth2.accessToken.create(result);
    } catch (error) {
        console.log('Access Token Error', error.message);
    }
});

// Get all Bitrix24 User
app.get('/allUser', async (req, res) => {
    try{
        const result = await bitrix24.callMethod('user.get');
        return res.json(result);        
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"});
    }
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});