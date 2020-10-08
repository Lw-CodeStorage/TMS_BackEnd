let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let multer = require('multer')
let mysql = require('./mysql');
let app = express();
app.use(cors())
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api', async (req, res) => {
    //console.log(req.body.get('type'));
    switch (req.body.type) {
        case '登入':
            await mysql.login(req.body.email, req.body.password).then((result) => {
                if (result == '帳號或密碼不存在') {
                    res.send(JSON.stringify({ "狀態": '登入異常', '訊息': result }))
                } else {
                    res.send(JSON.stringify({ "狀態": '登入成功', '訊息': result }))
                }
            }).catch((err) => {
                res.send(JSON.stringify({ "狀態": err }))
            })
            break
        case '註冊':
            await mysql.register(req.body.name, req.body.password, req.body.email, req.body.phone)
                .then((result) => {
                    if (result == '信箱重複') {
                        res.send(JSON.stringify({ "狀態": '註冊異常', '訊息': result }))
                    } else {
                        res.send(JSON.stringify({ "狀態": '註冊成功', '訊息': result }))
                    }
                }).catch((err) => {
                    res.send(JSON.stringify({ "狀態": err }))
                })
            break
        case '使用者資料':
            await mysql.userData(req.body.email).then((result) => {
                res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ "狀態": err }))
            })
            break
        case '學程查詢':
            await mysql.aqf_QID(req.body.industry).then((result) => {
                res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ "狀態": err }))
            })
            break
        case '課程查詢':
            await mysql.get_Uocid_ByQid(req.body.qid, req.body.industry).then((result) => {
                res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ "狀態": err }))
            })
            break
        case '職位查詢':
            await mysql.get_Onet_ByQid(req.body.qid, req.body.industry).then((result) => {
                res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ "狀態": err }))
            })
            break
        case '課程細節':
            await mysql.get_Course_ByUoc(req.body.uoc, req.body.industry).then((result) => {
                if (result.length) {
                    res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
                } else {
                    res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '無資料' }))
                }
            }).catch((err) => {
                res.send(JSON.stringify({ "狀態": err }))
            })
            break
        case '職位任務':
            await mysql.get_Task_ByOnet(req.body.onet).then((result) => {
                if (result.length) {
                    res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
                } else {
                    res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '無資料' }))
                }
            }).catch((err) => {
                res.send(JSON.stringify({ "狀態": 'err', '訊息': '資料庫發生問題' }))
            })
            break
        case '開設課程':
            await mysql.creatCourse(req.body.courseData).then((result) => {
                if (result == '課程開設成功') {
                    console.log(result)
                    res.send(JSON.stringify({ "狀態": '課程開設成功', '訊息': result }))
                } else {
                    console.log('result')
                    res.send(JSON.stringify({ "狀態": '課程開設失敗', '訊息': result }))
                }
            }).catch((err) => {
                console.log('err')
                res.send(JSON.stringify({ "狀態": 'err', '訊息': '資料庫發生問題' }))

            })
            break
        case '更新課程':
            await mysql.updataCourse(req.body.courseData).then((result) => {
                if (result == '課程更新成功') {
                    console.log(result)
                    res.send(JSON.stringify({ "狀態": '課程更新成功', '訊息': result }))
                } else {
                    console.log('result')
                    res.send(JSON.stringify({ "狀態": '課程更新失敗', '訊息': result }))
                }
            }).catch((err) => {
                console.log('err')
                res.send(JSON.stringify({ "狀態": 'err', '訊息': '資料庫發生問題' }))

            })
            break
        case '取得課程':
            await mysql.getCourse().then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '課程下載成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '課程下載失敗', '訊息': '課程下載失敗' }))
                //console.log(err);
            })
            break
        default:
            //console.log(...req.body);
            res.send(JSON.stringify({ "狀態": 'typeError', '訊息': '沒有type' }))
    }
})

// app.post('/getCourse', async function (req, res) {
//     await mysql.getCourse().then((result) => {
//         //console.log(res);
//         res.send(JSON.stringify({ '狀態': '課程下載成功', '訊息': result }))
//     }).catch((err) => {
//         res.send(JSON.stringify({ '狀態': '課程下載失敗', '訊息': '課程下載失敗' }))
//         //console.log(err);
//     })
// })
app.post('/getUserCourse', async function (req, res) {
    await mysql.getUserCourse(req.body.userID).then((res) => {
        console.log(res);
        // res.send(JSON.stringify({ '狀態': '課程設定成功', '訊息': '課程設定成功' }))
    }).catch((err) => {
        // res.send(JSON.stringify({ '狀態': '課程設定失敗', '訊息': '課程設定失敗' }))
        console.log(err);
    })
})
// app.post('/creatCourse', async function (req, res) {
//     await mysql.creatCourse(req.body).then((result) => {
//         //console.log(result);
//         res.send(JSON.stringify({ '狀態': '課程設定成功', '訊息': '課程設定成功' }))
//     }).catch((err) => {
//         res.send(JSON.stringify({ '狀態': '課程設定失敗', '訊息': '課程設定失敗' }))
//         // console.log(err);
//     })
// })
app.post('/courseImageUpload', async function (req, res) {
    //開課照片上傳
    let uploadTest = multer({
        storage: multer.diskStorage({
            //照片存放位置
            destination: function (req, file, cb) {
                cb(null, './upload')
            },
            //檔案名稱
            filename: function (req, file, cb) {
                // console.log(file);
                cb(null, `${file.originalname}.jpg`)
            }
        }),
        //single對應的是資料名稱
    }).single('courseImage')
    // console.log(req.body);
    uploadTest(req, res, function (err) {
        if (err) {
            //console.log('1');
            res.send(JSON.stringify({ '狀態': '上傳異常', '訊息': '上傳失敗' }))
        } else {
            // console.log('0');
            res.send(JSON.stringify({ '狀態': '上傳成功', '訊息': '上傳成功' }))
        }
    })
})

// //點擊職位 帶職位任務
// app.post('/get_Task_ByOnet', async function (req, res) {
//     try {
//         let result = await mysql.get_Task_ByOnet(req.body.onet)
//         if (result.length) {
//             res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
//         } else {
//             res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '無資料' }))
//         }


//     } catch {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '查詢失敗' }))
//     }
// })
// //點擊課程 帶課程細節
// app.post('/get_Course_ByUoc', async function (req, res) {
//     try {
//         let result = await mysql.get_Course_ByUoc(req.body.uoc, req.body.industry)
//         if (result.length) {
//             res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))
//         } else {
//             res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '無資料' }))
//         }


//     } catch {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '查詢失敗' }))
//     }
// })
// //課程
// app.post('/get_Uocid_ByQid', async function (req, res) {
//     try {
//         let result = await mysql.get_Uocid_ByQid(req.body.qid, req.body.industry)
//         res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))

//     } catch (error) {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '查詢失敗' }))
//     }
// })
// //職位
// app.post('/get_Onet_ByQid', async function (req, res) {
//     try {
//         let result = await mysql.get_Onet_ByQid(req.body.qid, req.body.industry)
//         res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))

//     } catch (error) {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '查詢失敗' }))
//     }
// })
// //第一個下拉選單 ‘產業’
// app.post('/aqf_QID', async function (req, res) {
//     try {
//         let result = await mysql.aqf_QID(req.body.industry)
//         res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))

//     } catch (error) {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": '查詢失敗', '訊息': '查詢失敗' }))
//     }
// })

// app.post('/upload', function (req, res) {
//     let upload = multer({
//         storage: multer.diskStorage({
//             //照片存放位置
//             destination: function (req, file, cb) {
//                 cb(null, './upload')
//             },
//             //檔案名稱
//             filename: function (req, file, cb) {
//                 //console.log(file);
//                 cb(null, `${file.originalname}.jpg`)
//             }
//         }),
//         //single 對應照片的名字
//     }).single('test')
//     upload(req, res, function (err) {
//         if (err) {

//             res.send(JSON.stringify({ '狀態': '上傳異常', '訊息': '上傳失敗' }))
//         } else {
//             res.send(JSON.stringify({ '狀態': '上傳成功', '訊息': '上傳成功' }))
//         }
//     })
// });

// app.get('/image', (req, res) => {
//     //post body 
//     //get query
//     //res.set('Content-Type', 'image/png')
//     //回影照片路徑
//     res.sendFile(`${__dirname}/upload/${req.query.email}.jpg`)
// })

// app.post('/userData', async (req, res) => {
//     try {
//         let result = await mysql.userData(req.body.email);
//         res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': result }))

//     } catch (error) {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": error }))
//     }
// })

// app.post('/register', async function (req, res) {
//     try {
//         let result = await mysql.register(req.body.name, req.body.password, req.body.email, req.body.phone);
//         console.log(result);
//         if (result == '信箱重複') {
//             res.send(JSON.stringify({ "狀態": '註冊異常', '訊息': result }))
//         } else {
//             res.send(JSON.stringify({ "狀態": '註冊成功', '訊息': result }))
//         }
//     } catch (error) {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": error }))
//     }
// });
// app.post('/login', async (req, res) => {
//     try {
//         let result = await mysql.login(req.body.email, req.body.password);
//         console.log(result);
//         if (result == '帳號或密碼不存在') {
//             res.send(JSON.stringify({ "狀態": '登入異常', '訊息': result }))
//         } else {
//             res.send(JSON.stringify({ "狀態": '登入成功', '訊息': result }))
//             user = result
//         }
//     } catch (error) {
//         console.log(error);
//         res.send(JSON.stringify({ "狀態": error }))
//     }
// })
app.use('/test', async (req, res) => {
    res.send(JSON.stringify({ '/test': 'test' }))
})

app.listen(8888, function () {
    console.log('CORS-enabled web server listening on port 8888')
});



