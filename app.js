var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello from Facebook Messenger Bot');
    // console.log(req);
});

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Lozinka.123') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
    var messaging_events = req.body.entry[0].messaging;

    for (i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            text = event.message.text;

            // Handle a text message from this sender
            if (text == 'Template') {
                sendGenericMessage(sender);
            } else {
                sendTextMessage(sender,
                    "Text received: "+ text.substring(0, 200));
            }
        }

        if (event.postback) {
            text = JSON.stringify(event.postback);
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
            continue;
        }
    }

    res.sendStatus(200);
});

var token = "EAAIe0fXGERkBADc7n5AHuDUw9uFPnMgrQkGoowotVNHfofs8Hnd6licZCC78kaWujBYvroWmRTWAbDBq78"+
    "ukdnJiLSwEQObwI0HCfen0q6JzGsXf15QgPZCzQnk4DGNYy3xti5SrrloIENWBV8ryMxYj9C7ZBlgbcMaykCOhgZDZD";

function sendTextMessage(sender, text) {
    var messageData = {
        text:text
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com/",
                        "title": "Web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                },{
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

app.listen();
