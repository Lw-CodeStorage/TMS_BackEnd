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
let userData = (email) => {

    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT * FROM users  WHERE email='${email}'`, (error, result, fields) => {
            if (result.length) {
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
let getCourse = () => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT
        course.id,
        course.courseName,
        course.courseInfo,
        course.courseLink,
        course.industry,
        course.qidSelect,
        course.courseSelect,
        course.positionSelect,
        course.time,
        users.userName,
        users.email
        FROM course LEFT JOIN users ON course.userID = users.id  ORDER BY time DESC`, (error, result, fields) => {
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
let deleteCourse = (deleteCourseID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`DELETE FROM course WHERE id='${deleteCourseID}'`, (error, result, fields) => {
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
let getUserCourse = (userID) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(con)
        connection.query(`SELECT *  FROM course WHERE userID = '${userID}'`, (error, result, fields) => {
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
module.exports = {
    register: register,
    login: login,
    userData: userData,
    aqf_QID: aqf_QID,
    get_Uocid_ByQid: get_Uocid_ByQid,
    get_Onet_ByQid: get_Onet_ByQid,
    get_Course_ByUoc: get_Course_ByUoc,
    get_Task_ByOnet: get_Task_ByOnet,
    creatCourse: creatCourse,
    updataCourse: updataCourse,
    getUserCourse: getUserCourse,
    getCourse: getCourse,
    deleteCourse:deleteCourse
}
