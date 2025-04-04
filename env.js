const path = require('path')



let dev = {
    
    dirPathProject: path.join(__dirname, ''),
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
    transporter:{
        host:'',
        port:587,
        secure:false,
        auth:{
            user:'',
            pass:''
        },
        tls:{
            rejectUnauthorized:false
        }
    },
    mailOptions:{
        from:''
    },
    frontTech:'javascript'
}

module.exports = {
     development:dev,
     production:{...dev,dbSqlitePath:path.join(__dirname,'/db/pro/sqlite/dbLogin.sqlite')},
     test:{...dev,dbSqlitePath:path.join(__dirname,'/db/test/sqlite/dbLoginTest.sqlite')}
}
