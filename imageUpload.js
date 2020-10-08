let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let multer = require('multer')
let mysql = require('./mysql');
let app = express();
app.use(cors())
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/imageUpload', function (req, res) {
    let upload = multer({
        storage: multer.diskStorage({
            //照片存放位置
            destination: function (req, file, cb) {
                cb(null, './upload')
            },
            //檔案名稱
            filename: function (req, file, cb) {
                //console.log(file);
                cb(null, `${file.originalname}.jpg`)
            }
        }),
        //single 對應照片的名字
    }).single('test')
    upload(req, res, function (err) {
        if (err) {

            res.send(JSON.stringify({ '狀態': '上傳異常', '訊息': '上傳失敗' }))
        } else {
            res.send(JSON.stringify({ '狀態': '上傳成功', '訊息': '上傳成功' }))
        }
    })
});

app.listen(8889, function () {
    console.log('CORS-enabled web server listening on port 8889')
});


