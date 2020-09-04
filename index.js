let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let mysql = require('./mysql');
const { resolve } = require('path');
let DB = new mysql()

console.log('NodeJS Start');
let app = express();
app.use(cors())
app.use(bodyParser.json({ extended: false }));
app.post('/', async function (req, res) {
       
        try {
            let result = await DB.init().register(req.body.name, req.body.password, req.body.email);
            console.log(result);
            res.send( JSON.stringify({"狀態":result}))
        } catch (error) {
            console.log(error);
            res.send( JSON.stringify({"狀態":error}))
        }
});
app.post('/login' ,async (req,res)=>{
        try {
            let result = await DB.init().login(req.body.email, req.body.password);
           console.log(result);
            res.send( JSON.stringify({"狀態":result}))
        }catch(error){
            console.log(error);
            res.send( JSON.stringify({"狀態":error}))
        }
})


app.listen(8888, function () {
    console.log('CORS-enabled web server listening on port 8888')
});

// 终端打印如下信息
//console.log('Server running at http://localhost:8888/');


