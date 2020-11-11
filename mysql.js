var mysql = require('mysql');
let con = {
    host: '60.249.180.235',
    port: '3306',
    user: 'fois_ios',
    password: 'fois_ios',
    database: 'fois_ios',
}

let register = (userName, password, email, phone) => {
    console.log(email);
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT email FROM users where email = '${email}'`, (error, result, fields) => {
            if (result.length) {
                resolve('信箱重複')
            } else {
                connection.query(`INSERT INTO users ( userName, passWord, email,phone, Authority) VALUES ('${userName}', '${password}', '${email}','${phone}', '老師')`,
                    (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            reject('註冊失敗')
                        }
                        //console.log('insert');
                        resolve('註冊成功')
                    })
            }
            connection.end();
        })

    })

}
let login = (email, password) => {

    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        console.log(email);
        console.log(password);
        connection.query(`SELECT  Authority FROM users  WHERE email='${email}' AND passWord='${password}'`, (error, result, fields) => {
            console.log(result);
            if (result.length) {
                if (error) {
                    reject('登入發生錯誤')
                }
                resolve('登入成功')
                //console.log('yes');
            } else {
                resolve('帳號或密碼不存在')
                // console.log('no');
            }
        })
        connection.end();
    })

}
//給重整用的
let userData = (email) => {
    console.log(`userData = ${email}`);
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT * FROM users  WHERE email='${email}'`, (error, result, fields) => {
            if (result) {
                //console.log(result);
                if (error) {
                    reject('登入發生錯誤')
                }
                resolve(result[0])
            } else {
                resolve('帳號或密碼不存在')
            }
        })
        connection.end();
    })

}
let FB = (userName, email, picture) => {
    console.log(`FB  = ${email}`);
    return new Promise((resolve, reject) => {
        if (email) {
            let connection = mysql.createConnection(con)
            connection.query(`SELECT email FROM users where email = '${email}'`, (error, result, fields) => {
                //console.log(result);
                if (result) {
                    //已註冊過 撈資料
                    connection.query(`SELECT * FROM users  WHERE email='${email}'`, (error, result, fields) => {
                        if (error) {
                            reject('會員資料發生錯誤')
                        }
                        //console.log('已註冊過');
                        resolve('已註冊過')
                    })
                } else {
                    //沒註冊 幫你註冊
                    connection.query(`INSERT INTO users ( userName, passWord, email,phone, Authority,picture) VALUES ('${userName}', '', '${email}','', '學生','${picture}')`,
                        (error, results, fields) => {
                            if (error) {
                                reject('註冊失敗')
                            }
                            // console.log('註冊成功')
                            resolve('註冊成功')
                        })
                }
                connection.end();
            })
        } else {
            reject('沒有Email')
        }


    })
}
let FB_userData = (email) => {
    console.log(`FB_userData  = ${email}`);
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT * FROM users  WHERE email='${email}'`, (error, result, fields) => {
            if (error) {
                reject('會員資料發生錯誤')
            } else {
                // console.log(result);
                resolve(result[0])
            }

        })
        connection.end();
    })
}
let aqf_QID = (industry) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT QID,QID_Name,QID_Description FROM fois_aqf_${industry}_QID_content`, (error, result, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(result);
            }
        })
        connection.end();
    })
}

let get_Uocid_ByQid = (selectQid, industry) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT UOC_ID,UOC_TITLE FROM fois_aqf_${industry}_UOC_content WHERE QID = '${selectQid}'`, (error, result, fields) => {
            if (error) {
                reject(error)
            } else {
                //console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}

let get_Onet_ByQid = (selectQid, industry) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT soc_id ,soc_title FROM onet_twnl_isco WHERE isco_id =(
                         SELECT isco_code FROM fois_anzsco_to_isco WHERE anzsco_code = (
                        SELECT ANZSCO FROM fois_aqf_${industry}_QID_content WHERE QID = '${selectQid}'))`, (error, result, fields) => {
            if (error) {
                reject(error)
                // console.log(error);
            } else {
                //console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })

}

let get_Course_ByUoc = (selectUoc, industry) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT Performance_Criteria  FROM fois_aqf_${industry}_course WHERE CODE = '${selectUoc}'`, (error, result, fields) => {
            if (error) {
                reject(error)
            } else {
                // console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}

let get_Task_ByOnet = (selectOnet) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT soc_dwa_desc  FROM onet_task WHERE soc_id = '${selectOnet}'`, (error, result, fields) => {
            if (error) {
                // console.log(error);
                reject(error)
            } else {
                //console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}

let creatCourse = (courseData) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        console.log(courseData);
        connection.query(`INSERT INTO
         course(userID,courseName,courseInfo,courseLink,industry,qidSelect,courseSelect,positionSelect)
         VALUES(
            '${courseData.userID}',
            '${courseData.courseName}',
            '${courseData.courseInfo}',
            '${courseData.courseLink}',
            '${courseData.industry}',
            '${courseData.qidSelect}',
            '${courseData.courseSelect}',
            '${courseData.positionSelect}'
            )`, (error, result, fields) => {
            if (error) {
                console.log(error);
                reject('課程開設失敗')
            } else {
                //console.log(result);
                resolve('課程開設成功');
            }
        })
        connection.end();
    })
}
let updataCourse = (courseData) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        console.log(courseData);
        connection.query(`UPDATE course SET
        courseName = '${courseData.courseName}',
        courseInfo = '${courseData.courseInfo}',
        courseLink = '${courseData.courseLink}',
        industry =  '${courseData.industry}',
        qidSelect =  '${courseData.qidSelect}',
        courseSelect = '${courseData.courseSelect}',
        positionSelect = '${courseData.positionSelect}'
        WHERE  id = '${courseData.courseID}'
            `, (error, result, fields) => {
            if (error) {
                console.log(error);
                reject('課程更新失敗')
            } else {
                //console.log(result);
                resolve('課程更新成功');
            }
        })
        connection.end();
    })
}
//得到老師所有課程
let getTeacherCourse = (userID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT *
        FROM course WHERE userID = '${userID}' `, (error, result, fields) => {
            if (error) {
                //console.log(error);
                reject(error)
            } else {
                // console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}
//得到特定特課程資料
let getCourseData = (courseID) =>{
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT *
        FROM course WHERE id = '${courseID}' `, (error, result, fields) => {
            if (error) {
                //console.log(error);
                reject('取得課程資料失敗 資料庫問題')
            } else {
                // console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}
//刪除課程要偵測有沒有被綁在班上面
let deleteTeacherCourse = (deleteCourseID, userID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT 班級名稱,加入班級的課程 FROM class WHERE userID = '${userID}'`, (error, result, fields) => {

            if (result.length) {
                let repeatClass = []
                //console.log(result);
                //有班級 就要拆解 加入班級的課程json
                result.forEach((item, index) => {
                    //將被加入班級的課 解json
                    let courseInClass = JSON.parse(item['加入班級的課程'])
                    //判斷 要刪除的課有沒有在般裡面
                    courseInClass.forEach((item2) => {
                        // console.log(item)
                        if (item2.courseID == deleteCourseID) {
                            repeatClass.push(item['班級名稱'])
                        }
                    })

                });

                if (repeatClass.length) {
                    //有班級有這門課 不能刪
                    resolve(repeatClass);

                } else {
                    //沒有班級有這門 可以刪
                    connection.query(`DELETE FROM course WHERE id = '${deleteCourseID}'`, (error, result, fields) => {
                        if (error) {
                            console.log(error)
                            reject(error)
                        } else {
                            resolve('課程刪除成功');
                        }
                    })
                }
            } else {
                //沒有班級 直接刪除課程
                connection.query(`DELETE FROM course WHERE id = '${deleteCourseID}'`, (error, result, fields) => {
                    if (error) {
                        console.log(error)
                        reject(error)
                    } else {
                        resolve('課程刪除成功');
                    }
                })
            }

        })


    })
}
let creatClass = (classData) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        // console.log(classData['開班資訊']['加入班級的課程'])
        connection.query(
            `INSERT INTO
            class(userID,imageUid,班級名稱,上課地點,學科,術科,實習,報名連結,人數限制,聯絡人,聯絡電話,開始日期,結束日期,描述,加入班級的課程)
            VALUES(
            '${classData['userID']}',
            '${classData['imageUid']}',
            '${classData['班級名稱']}',
            '${classData['上課地點']}',
            '${classData['學科']}',
            '${classData['術科']}',
            '${classData['實習']}',
            '${classData['報名連結']}',
            '${classData['人數限制']}',
            '${classData['聯絡人']}',
            '${classData['聯絡電話']}',
            '${classData['開始日期']}',
            '${classData['結束日期']}',
            '${classData['描述']}',
            '${classData['加入班級的課程']}'
            )`
            , (error, result, fields) => {
                if (error) {
                    //  console.log(error);
                    reject(error)
                } else {
                    //    console.log(result);
                    resolve(result);
                }
            })
        connection.end();
    })
}
let getTeacherClass = (userID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`
        SELECT
        class.id,
        class.userID,
        class.imageUid,
        class.班級名稱,
        class.上課地點,
        class.學科,
        class.術科,
        class.實習,
        class.報名連結,
        class.人數限制,
        class.聯絡人,
        class.聯絡電話,
        class.開始日期,
        class.結束日期,
        class.描述,
        class.加入班級的課程,
        users.email,
        users.picture
        FROM class  INNER JOIN users ON class.userID = users.id
        AND users.id = ${userID}
`, (error, result, fields) => {
            if (error) {
                //  console.log(error);
                reject(error)
            } else {
                // console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}
let updataTeacherClass = (classData) => {
    console.log(classData);
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`UPDATE class SET
        班級名稱 = '${classData.班級名稱}',
        上課地點 = '${classData.上課地點}',
        學科 = '${classData.學科}',
        術科 =  '${classData.術科}',
        實習 =  '${classData.實習}',
        報名連結 =  '${classData.報名連結}',
        人數限制 =  '${classData.人數限制}',
        聯絡人 = '${classData.聯絡人}',
        聯絡電話 = '${classData.聯絡電話}',
        開始日期 = '${classData.開始日期}',
        結束日期 = '${classData.結束日期}',
        描述 = '${classData.描述}',
        加入班級的課程 = '${classData.加入班級的課程}'
        WHERE  id = '${classData.classID}'`,
            (error, result) => {
                if (error) {
                    //    console.log('error');
                    reject(error)
                } else {
                    //   console.log(result);
                    resolve('班級更新成功');
                }
            })
    })
}
let getClassApllyNumber = (classID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        //要去判斷狀態 失敗的不算
        connection.query(`SELECT COUNT(*) as 人數 FROM apply WHERE classID = '${classID}' AND (狀態='等待審核'OR 狀態= '報名成功')`,
            (error, result) => {
                if (error) {
                    //    console.log('error');
                    reject('取得該班報名人數失敗')
                } else {
                    //   console.log(result);
                    resolve(result);
                }
            })
    })

}
let getClassApllyPerson = (classID) => {
    //console.log(classID);
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT
        users.id as userID,
        users.userName,
        users.email,
        users.picture,
        apply.id as applyID,
        apply.classID,
        apply.狀態
        FROM users
        INNER JOIN apply ON users.id = apply.userID AND classID = '${classID}'
        `,
            (error, result) => {
                if (error) {
                    //    console.log('error');
                    reject('取得該班報名學員資料失敗')
                } else {
                    //   console.log(result);
                    resolve(result);
                }
            })
    })

}
let comfirmApplyState = (state, applyID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`UPDATE apply SET 狀態 = '${state}' WHERE id ='${applyID}'`,
            (error, result) => {
                if (error) {
                    //    console.log('error');
                    reject('更新報名狀態失敗')
                } else {
                    //   console.log(result);
                    resolve('更新報名狀態成功');
                }
            })
    })
}
//得到class設定的狀態
let classScoreState = (classID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT class.學科,class.術科,class.實習 FROM class WHERE class.id  = '${classID}'`,
            (error, result) => {
                if (error) {
                    //    console.log('error');
                    reject('取得評分項目失敗')
                } else {
                    //   console.log(result);
                    resolve(result);
                }
            })
    })
}
let updataScore = (scoreType, scoreData, applyID) => {
    //更新評分的值
    //console.log(scoreType,scoreData, applyID);
    let connection = mysql.createConnection(con)
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE apply SET ${scoreType} = '${scoreData}' WHERE  id = '${applyID}'`,
            (error, result) => {
                if (error) {
                    //    console.log('error');
                    reject('評分失敗')
                } else {
                    //   console.log(result);
                    resolve('評分成功');
                }
            })
    })

}
let getScore = (arrayApplyID) => {
    let connection = mysql.createConnection(con)
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM apply WHERE  id  in(${arrayApplyID})`,
            (error, result) => {
                if (error) {
                    // console.log(error);
                    reject('取得評分失敗')
                } else {
                    console.log(result);
                    resolve(result);
                }
            })
    })
}
/////////公開
let publicGetClass = () => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        // 搜尋class 最新兩筆
        // ORDER BY class.time DESC LIMIT 2
        connection.query(`SELECT
        class.id,
        class.userID,
        class.imageUid,
        class.班級名稱,
        class.上課地點,
        class.學科,
        class.術科,
        class.實習,
        class.報名連結,
        class.人數限制,
        class.聯絡人,
        class.聯絡電話,
        class.開始日期,
        class.結束日期,
        class.描述,
        class.加入班級的課程,
        users.email,
        users.picture
        FROM class  LEFT JOIN users ON users.id=class.userID  `, (error, result, fields) => {
            if (error) {
                // console.log(error);
                reject('publicGetClass 資料庫失敗')
            } else {
                //console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}
//使用者報名班級
let userApply = (applyData) => {

    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        // 搜尋class 最新兩筆
        // ORDER BY class.time DESC LIMIT 2
        connection.query(`INSERT INTO
        apply(classID,userID,狀態)
        VALUES(
        '${applyData['classID']}',
        '${applyData['userID']}',
        '等待審核'
        )`, (error, result, fields) => {
            if (error) {
                //console.log(error);
                reject('報名失敗')
            } else {
                //console.log(result);
                resolve('報名成功');
            }
        })
        connection.end();
    })
}
//使用者已報名班級
let userGetClass = (userID) => {
    console.log(`userGetClass = ${userID}`);
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        //console.log(userID);
        //要去判斷狀態 報名失敗的不列入前端比較
        
        
        connection.query(`SELECT
		users.email,
        apply.id as applyID,
        apply.classID,
        apply.userID,
        apply.狀態,
        apply.學科 AS 學科評分,
        apply.術科 AS 術科評分,
        apply.實習 AS 實習評分,
        class.userID AS TeachID,
        class.imageUid,
        class.班級名稱,
        class.上課地點,
        class.學科,
        class.術科,
        class.實習,
        class.報名連結,
        class.人數限制,
        class.聯絡人,
        class.聯絡電話,
        class.開始日期,
        class.結束日期,
        class.描述,
        class.加入班級的課程
        FROM (
            (
            apply INNER JOIN class ON
        	apply.classID  = class.id AND
        	apply.userID = ${userID}
        	AND(狀態='等待審核' OR 狀態='報名成功')
            ) 
            INNER JOIN users ON
            users.id = class.userID
        ) 
        `, (error, result, fields) => {
            if (error) {
                //console.log(error);
                reject('使用者已報名班級查詢失敗')
            } else {
                console.log(result);
                resolve(result);
            }
        })
        connection.end();
    })
}

module.exports = {
    register: register,
    login: login,
    userData: userData,
    FB: FB,
    FB_userData: FB_userData,
    aqf_QID: aqf_QID,
    get_Uocid_ByQid: get_Uocid_ByQid,
    get_Onet_ByQid: get_Onet_ByQid,
    get_Course_ByUoc: get_Course_ByUoc,
    get_Task_ByOnet: get_Task_ByOnet,

    creatCourse: creatCourse,
    getTeacherCourse: getTeacherCourse,
    updataCourse: updataCourse,
    deleteTeacherCourse: deleteTeacherCourse,

    creatClass: creatClass,
    getTeacherClass: getTeacherClass,
    updataTeacherClass: updataTeacherClass,
    getClassApllyNumber: getClassApllyNumber,
    getClassApllyPerson: getClassApllyPerson,
    comfirmApplyState: comfirmApplyState,
    classScoreState: classScoreState,//取得評分項目
    updataScore: updataScore,//更新評分項目
    getScore: getScore,//取得評分分數
    //user
    userApply: userApply,
    userGetClass: userGetClass,

    //public
    publicGetClass: publicGetClass,
    getCourseData:getCourseData
}
