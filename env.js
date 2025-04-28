const path = require('path')
const confEmail = require('./confEmail.js')
const confSMS = require('./confSMS.js')


let dev = {
    
    dirPathProject: path.join(__dirname, ''),
    dirPathCordovaProject: path.join(__dirname,'..','stepByStepCordova/www'),
    dirPathCordovaViews: path.join(__dirname,'cordova/views/public/javascriptViews'),
    dirPathLogger:path.join(__dirname,'/modules/logger'),
    logsFileName:'logs.txt',
    numberLinesLog:10,
    scriptCompressProject:{
        nodeModulesFolderName:path.join(__dirname,''),
        zipFolderName: 'zipVersion',
        zipOutputPath: path.join(__dirname, '..','/aws/zipVersions'),
        version:'1_0_0',
    },
    dbSqlitePath:path.join(__dirname,'/db/dev/sqlite/dbLoginDev.sqlite'),
    domain:'http://localhost:3000',
    confEmail:true,
    confSMS:true,
    transporter:confEmail.transporter,
    mailOptions:confEmail.mailOptions,
    confSMS:confSMS,
    frontTech:'javascript',
    frontTheme:'theme-default',
    backAPI:'stepByStep-back-node-sqlite'

}

module.exports = {
     development:dev,
     production:{...dev,dbSqlitePath:path.join(__dirname,'/db/pro/sqlite/dbLogin.sqlite')},
     test:{...dev,dbSqlitePath:path.join(__dirname,'/db/test/sqlite/dbLoginTest.sqlite')}
}
