# stepByStep
a 2FA code structure that uses email as second step item receiver.

## Create dev dataBase

    npm run createDbDev

## Create test dataBase

    npm run createDbTest

## Run test

    npm run test

## Render on dev environment

    npm run render

## Configure email
    
    Modify file env.js

    replace <host>, <user>, <pass>, <from>
    
    transporter:{
        host:<host>,
        port:587,
        secure:false,
        auth:{
            user:<user>,
            pass:<pass>
        },
        tls:{
            rejectUnauthorized:false
        }
    },
    mailOptions:{
        from:<from>
    },



## Start server

    npm run start

    http://localhost:3000/view/basic-start

## Render pro
    
    npm run renderPro

## Configure dbPro
    
    Modify file env.js
    
    Replace <dbPro>
    
    module.exports = {
     development:dev,
     production:{...dev,dbSqlitePath: <dbPro> },
     test:{...dev,dbSqlitePath:path.join(__dirname,'/db/test/sqlite/dbLoginTest.sqlite')}

}

## Start server pro
 
    npm run startPro

    http://localhost:3000/view/basic-start


