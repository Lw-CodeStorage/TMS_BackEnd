const { rejects } = require('assert');
const { error } = require('console');
var mysql = require('mysql');
const { resolve } = require('path');
let connection = mysql.createConnection({
    host: '60.249.180.235',
    port: '3306',
    user: 'fois_ios',
    password: 'fois_ios',
    database: 'fois_ios',
});
connection.connect(function (err) {
    if (err) throw err;
    console.log('connect success!');
});
~ async function query() {

    let result = await connection.query(`SELECT email FROM users `, (error, result, fields) => {
        return (result)
    })

    console.log(result);

}()

console.log("12312312312312");


