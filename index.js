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
        case 'FB':
            await mysql.FB(req.body.name, req.body.email, req.body.picture)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                res.send(JSON.stringify({ "狀態": err }))
            })
            await mysql.FB_userData(req.body.email)
            .then((data) => {
                console.log(data)
                res.send(JSON.stringify({ "狀態": '查詢成功', '訊息': data }))
            })
            .catch((err) => {
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
        case '更新課程(目前沒有用到)':
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
        case '取得老師課程':
            await mysql.getTeacherCourse(req.body.userID).then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '課程下載成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '課程下載失敗', '訊息': '課程下載失敗' }))
                //console.log(err);
            })
            break
        case '取得課程資料':
            await mysql.getCourseData(req.body.courseID).then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '取得課程資料成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '取得課程資料失敗', '訊息': err }))
                //console.log(err);
            })
            break
        case '刪除老師課程':
            await mysql.deleteTeacherCourse(req.body.deleteCourseID, req.body.userID)
                .then((result) => {
                    //console.log(res);
                    if (result == '課程刪除成功') {
                        res.send(JSON.stringify({ '狀態': '課程刪除成功', '訊息': result }))
                    } else {
                        res.send(JSON.stringify({ '狀態': '課程有相依不能刪除', '訊息': result }))
                    }

                }).catch((err) => {
                    res.send(JSON.stringify({ '狀態': '課程刪除失敗', '訊息': '課程刪除失敗' }))
                    //console.log(err);
                })
            break
        case '開設班級':
            await mysql.creatClass(req.body.classData).then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '班級開設成功', '訊息': '班級開設成功' }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '班級開設失敗', '訊息': '班級開設失敗' }))
                //console.log(err);
            })
            break
        case '取得老師班級':
            await mysql.getTeacherClass(req.body.userID).then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '班級下載成功', '訊息': result }))
            }).catch((err) => {

                res.send(JSON.stringify({ '狀態': '班級下載失敗', '訊息': '班級下載失敗' }))
                //console.log(err);
            })
            break
        case '更新老師班級':

            await mysql.updataTeacherClass(req.body.classData).then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '班級更新成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '班級更新失敗', '訊息': '班級更新失敗' }))
                //console.log(err);
            })
            break
        case '取得該班報名人數':
            await mysql.getClassApllyNumber(req.body.classID).then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '取得該班報名人數成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '取得該班報名人數失敗', '訊息': err }))
                //console.log(err);
            })
            break
        case '取得該班報名學員資料':
            await mysql.getClassApllyPerson(req.body.classID).then((result) => {
                //console.log(res);
                res.send(JSON.stringify({ '狀態': '取得該班報名學員資料', '訊息': result }))
            }).catch((err) => {
                //res.send(JSON.stringify({ '狀態': '取得該班報名人數失敗', '訊息': err }))
                console.log(err);
            })
            break
        case '更新報名狀態':
            await mysql.comfirmApplyState(req.body.state, req.body.applyID).then((result) => {
                console.log(result);
                res.send(JSON.stringify({ '狀態': '更新報名狀態成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '更新報名狀態失敗', '訊息': err }))
                console.log(err);
            })
            break
        case '取得評分項目':
            await mysql.classScoreState(req.body.classID).then((result) => {
                //console.log(result);
                res.send(JSON.stringify({ '狀態': ' 取得評分項目成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': ' 取得評分項目失敗', '訊息': err }))
                // console.log(err);
            })
            break
        case '更新評分項目':
            await mysql.updataScore(req.body.scoreType, req.body.scoreData, req.body.applyID).then((result) => {
                //console.log(result);
                //return mysql.getScore(req.body.applyID)
                res.send(JSON.stringify({ '狀態': ' 取得評分成功', '訊息': data }))
                // }).then((data) => {
                //     //console.log(data);
                //     res.send(JSON.stringify({ '狀態': ' 取得評分成功', '訊息': data }))
            })
                .catch((err) => {
                    //console.log(err);
                    res.send(JSON.stringify({ '狀態': ' 取得評分失敗', '訊息': err }))
                })
            break
        case '取得評分分數':
            //console.log(req.body.arrayApplyID);
            await mysql.getScore(req.body.arrayApplyID).then((result) => {
                console.log(result);
                res.send(JSON.stringify({ '狀態': ' 取得評分成功', '訊息': result }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': ' 取得評分失敗', '訊息': err }))
                console.log(err);
            })
            break
        ////////////////????????/////////?????????////
        case '報名班級':
            await mysql.userApply(req.body.applyData).then((data) => {
                res.send(JSON.stringify({ '狀態': '報名成功', '訊息': data }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '報名失敗', '訊息': 'err' }))
            })
            break
        case '使用者已報名班級':

            await mysql.userGetClass(req.body.userID).then((data) => {
               

                 res.send(JSON.stringify({ '狀態': '使用者已報名班級查詢成功', '訊息': data }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '使用者已報名班級查詢失敗', '訊息': err }))
            })
            break
        case '公開取得班級':
            await mysql.publicGetClass().then((data) => {
                res.send(JSON.stringify({ '狀態': '公開班級取得成功', '訊息': data }))
            }).catch((err) => {
                res.send(JSON.stringify({ '狀態': '公開班級取得失敗', '訊息': err }))
            })
            break
        default:
            //console.log(...req.body);
            res.send(JSON.stringify({ "狀態": 'typeError', '訊息': '沒有type' }))
    }
})

app.use('/test', async (req, res) => {
    res.send(JSON.stringify({ '/test': 'test' }))
})

app.listen(8888, function () {
    console.log('CORS-enabled web server listening on port 8888')
});



