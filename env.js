const path = require('path')

const confEmail = require('./confEmail.js')

const confSMS = require('./confSMS.js')

const confFrontTheme = require('./confFront.js')

const confBackAPI = require('./confBack.js')

const confCordova = require('./confCordova.js')

const confLogs = require('./confLog.js')

const confAI = require('./confAI.js')

let dev = {
    
    dirPathProject: path.join(__dirname, ''),
    dirPathCordovaProject: confCordova.pathCordovaProject,
    dirPathCordovaViews: confCordova.pathCordovaViews,
    dirPathLogger: confLogs.dirPathLogger,
    logsFileName: confLogs.logsFileName,
    numberLinesLog: confLogs.numberLinesLog,
    dbSqlitePath:path.join(__dirname,'/db/dev/sqlite/dbLoginDev.sqlite'),
    domain:'http://localhost:3000',
    transporter:confEmail.transporter,
    mailOptions:confEmail.mailOptions,
    confEmail:true,
    confSMS:confSMS,
    frontTheme:confFrontTheme.name,
    backAPI:confBackAPI.name,
    confAI:confAI

}

module.exports = {
     development:dev,
     production:{...dev,dbSqlitePath:path.join(__dirname,'/db/pro/sqlite/dbLogin.sqlite')},
     test:{...dev,dbSqlitePath:path.join(__dirname,'/db/test/sqlite/dbLoginTest.sqlite')}
}
