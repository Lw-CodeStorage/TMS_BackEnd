var mysql = require('mysql');

let connection = mysql.createConnection({
    host: '60.249.180.235',
    port: '3306',
    user: 'fois_ios',
    password: 'fois_ios',
    database: 'fois_ios',
});

let register = (userName, password, email, Authority) => {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT email FROM users where email = '${email}'`, (error, result, fields) => {
            if (result.length) {
                resolve('信箱重複')
            } else {
                connection.query(`INSERT INTO users ( userName, passWord, email, Authority) VALUES ('${userName}', '${password}', '${email}', '學生')`,
                    (error, results, fields) => {

                        if (error) {
                            //console.log(error);
                            reject('註冊失敗')
                        }
                        //console.log('insert');
                        resolve('註冊成功')

                    })
            }

        })

    })
    connection.end();
}

let login = (email, password) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT  Authority FROM users  WHERE email='${email}' AND passWord='${password}'`, (error, result, fields) => {
            if (result.length == 0) {
                //console.log(result);
                resolve('帳號或密碼不存在')
            } else {
                if (error) {
                    reject('登入發生錯誤')
                }

                resolve(result[0]['Authority'])
            }
        })

    })
    connection.end();
}



module.exports = { register: register, login: login }
