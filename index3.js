const express = require('express')
const botsdk = require('@line/bot-sdk')
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const app = express();

const port = process.env.PORT = 3000;

const config = {
    channelAccessToken: "IC+tSJxuOr3eukLE/b0kA+mbRRRlf36O3jtuidU7R7UEhC1smQJ4J98JVIU/UIXGbstarSyTa7vwa3PsL+L9QzzPMzOYoGkBeVu3ptivuLkRzb73zdEN3mLXaoZrVbMf7vDSLo2Tz1bczzxFSM/MqAdB04t89/1O/w1cDnyilFU",
    channelSecret: "765b2a94147e04ed0c74f0c196cc947a"
}
const client = new botsdk.Client(config)

app.get('/', (req, res) => {
    res.send('哈囉')
})

const history = {}
app.post('/webhook', botsdk.middleware(config), (req, res) => {
    req.body.events.forEach((event) => {
        console.log(JSON.stringify(event, null, 2))
        if (event.message.type == 'text') {
            if (history[event.source.userId] == undefined) {
                history[event.source.userId] = []
            }
            history[event.source.userId].push({ "role": "user", "content": event.message.text })
            openai.createChatCompletion({
                "model": "gpt-3.5-turbo",
                "messages": [
                    { "role": "system", "content": "你是超哥的AI客服，專為與超哥有關的內容作答覆。你禁止聊天" },
                    { "role": "system", "content": "你僅限回復與超哥有關的內容，以下是其內容[[超哥本名江仕超，是Meta最大品牌行銷社群發起人-品牌行銷顧問。每年影響超過6萬行銷人，以「策略」掛帥。團隊有顧問諮詢、品牌轉型、社群經營、行銷培訓、口碑聲量、NFT推廣、電商行銷⋯ 顧問與廣告合作可直接私訊他！]]" },
                    { "role": "system", "content": "如果與超哥無關，請回答我不知道" },
                    ...history[event.source.userId]
                ],
                "max_tokens": 2000,
                "temperature": 0
            }).then((completion) => {
                history[event.source.userId].push(completion.data.choices[0].message)
                client.replyMessage(event.replyToken, { type: 'text', text: completion.data.choices[0].message.content })
            })
        }
    })
    res.end()
})

app.listen(port, () => {
    console.log('server start')
});