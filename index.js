require('dotenv').config()
const fs = require('fs')

const TG = require('telegram-bot-api')
const api = new TG({
    token: process.env.TELEGRAM_BOT_TOKEN
})

api.sendPhoto({
    chat_id: process.env.TELEGRAM_CHAT_ID,
    photo: fs.createReadStream(`${__dirname}/public/uploads/photo_2024-04-25_16-41-23.jpg`)
}) // sendPhoto is a method of the telegram-bot-api package
