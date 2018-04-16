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

const cote = require('cote');
const express = require('express');
const b24 = require('b24');

const app = express()

// A Responder that shall listen for the Rest Api calls
const responder = new cote.Responder({ name: ' bitrix rest calls webhooks responder ' });

const bitrix24 = new b24.Bitrix24({
    config: {
        mode: "webhook",
        host: "your bitrix host",
        user_id: "1",
        code: "your_webhook_code"
    }
})

responder.on('webhook', async (req, res) => { // ideally, you would sanitize your input here.
    // res(req.amount * rates[`${req.from}_${req.to}`]);
    try{
        // const result = await bitrix24.callMethod('user.get', {"ID": 13});
        const result = await bitrix24.callMethod('user.add', {"EMAIL": "chris@eke.co.ke", "EXTRANET": "Community"});
        console.log(result)
        return result;        
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"});
    }
});