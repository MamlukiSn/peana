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

// responder.on('api', async (req, res) => { // ideally, you would sanitize your input here.

//     console.log(`${req.ip} requested responder`);

//     app.runMiddleware('/auth', function (code, body, headers) {
//         if(code==301 || code==302) {// Redirect HTTP codes
//             console.log('Redirect to:', headers.location)
//         }
//     })
//     // app.runMiddleware('/auth',function(code,body,headers) {
//     //     console.log('User Details:',body)
//     // })

// });


userResponder.on('api2', (req) => app.runMiddleware(req.path, {}, function(code, data, headers) {
    console.log(code) // 301
    console.log(headers.location) // bitrix24.auth.authorization_uri
}));


// Bitrix auth
app.get('/auth', function(req, res, next) {
    console.log(`requested end-user interface`);

    res.redirect(bitrix24.auth.authorization_uri);

    console.log(`requested redirect`, bitrix24.auth.authorization_uri);

    console.log(`requested result`);

    console.log('Request URL:', req.originalUrl)

    // res.sendFile(__dirname + '/index.html');
    // if the user ID is 0, skip to the next route
    if (req.statusCode === 304) next('route')
    // otherwise pass the control to the next middleware function in this stack
    else next()

}, function (req, res, next) {
    // render a regular page
    console.log('Request Type:', req.method)
    next()
})

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', async (req, res) => {

    console.log(`requested callback`);

    try{
        const code = req.query.code;
        console.log('callback:', code);
        const result = await bitrix24.auth.getToken(code);
        console.log('callback result:', result);
        return res.json(result);
    }catch(err){
        console.log('callback err:', err)
        return res.status(500).json({message:"Authentication Failed"});
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