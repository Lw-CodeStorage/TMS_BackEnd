let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let mysql = require('./mysql');
const { resolve } = require('path');

let app = express();
app.use(cors())
app.use(bodyParser.json({ extended: false }));
app.post('/register', async function (req, res) {

    try {
        let result = await mysql.register(req.body.name, req.body.password, req.body.email, req.body.phone);
        console.log(result);
        if (result == '信箱重複') {
            res.send(JSON.stringify({ "狀態": '註冊異常', '訊息': result }))
        } else {
            res.send(JSON.stringify({ "狀態": '註冊成功', '訊息': result }))
        }
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({ "狀態": error }))
    }
});
app.post('/login', async (req, res) => {
    try {
        let result = await mysql.login(req.body.email, req.body.password);
        console.log(result);
        result == '帳號或密碼不存在'? 
        res.send(JSON.stringify({ "狀態": '登入異常','訊息': result })):
        res.send(JSON.stringify({ "狀態": '註冊成功', '訊息': '登入成功' }))
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({ "狀態": error }))
    }
})


app.listen(8888, function () {
    console.log('CORS-enabled web server listening on port 8888')
});



