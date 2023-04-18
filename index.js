const express = require('express');
const botsdk = require('@line/bot-sdk')

const app = express();

const port = 3000;

const  config = {
    channelAccessToken: "IC+tSJxuOr3eukLE/b0kA+mbRRRlf36O3jtuidU7R7UEhC1smQJ4J98JVIU/UIXGbstarSyTa7vwa3PsL+L9QzzPMzOYoGkBeVu3ptivuLkRzb73zdEN3mLXaoZrVbMf7vDSLo2Tz1bczzxFSM/MqAdB04t89/1O/w1cDnyilFU=",
    channelSecret: "765b2a94147e04ed0c74f0c196cc947a"
}
const  client = new botsdk.Client(config)

app.get('/', (req, res) => {
    res.send('哈囉')
})


app.post('/webhook', botsdk.middleware(config), (req, res) => {
    req.body.events.map((event) => {
        console.log(JSON.stringify(event, null, 2))
        if (event.message.type == 'text') {
            client.replyMessage(event.replyToken, { type: 'text', text: event.message.text })
        }
    })
    res.end()
})

app.listen(port, () => {
    console.log('server start')
});