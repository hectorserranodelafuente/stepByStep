const path = require('path')

const confEmail = require('./confEmail.js')

const confSMS = require('./confSMS.js')

const confFrontTheme = require('./confFront.js')

const confBackAPI = require('./confBack.js')

let dev = {
    
    dirPathProject: path.join(__dirname, ''),
    dirPathCordovaProject: path.join(__dirname,'..','stepByStepCordova/www'),
    dirPathCordovaViews: path.join(__dirname,'cordova/views/public/javascriptViews'),
    dirPathLogger:path.join(__dirname,'/modules/logger'),
    logsFileName:'logs.txt',
    numberLinesLog:10,
    dbSqlitePath:path.join(__dirname,'/db/dev/sqlite/dbLoginDev.sqlite'),
    domain:'http://localhost:3000',
    transporter:confEmail.transporter,
    mailOptions:confEmail.mailOptions,
    confEmail:true,
    confSMS:confSMS,
    frontTheme:confFrontTheme.name,
    backAPI:confBackAPI.name

}

module.exports = {
     development:dev,
     production:{...dev,dbSqlitePath:path.join(__dirname,'/db/pro/sqlite/dbLogin.sqlite')},
     test:{...dev,dbSqlitePath:path.join(__dirname,'/db/test/sqlite/dbLoginTest.sqlite')}
}
