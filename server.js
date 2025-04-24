const logger = require('./modules/logger/logger.js')
let sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const { createHmac } = require('node:crypto');
const express = require('express')
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const cron = require('node-cron')
const app = express()
const port = 3000
const utils = require('./modules/api/utilsAuth.js')
var cors = require('cors')


mailCredentials = null


async function  main() {

    const views = require('./modules/views/views.js')
    const viewsRegister = require('./modules/views/viewsDeclaration.js')



    const Auth = require('./modules/api/auth.js')


    const SignUp = require('./modules/api/signUp.js')
    const inst_signUp = new SignUp(process.argv)

    const ConfirmSignUp = require('./modules/api/confirmSignUp.js')
    const inst_confirmSignUp  = new ConfirmSignUp(process.argv)

    const Login = require('./modules/api/login.js')
    const inst_login = new Login(process.argv)

    const Confirm2FA = require('./modules/api/confirm2FA.js')
    const inst_confirm2FA = new Confirm2FA(process.argv)

    const Cookies = require('./modules/api/cookies.js')
    const inst_cookies = new Cookies(process.argv)

    const CloseSession = require('./modules/api/closeSession.js')
    const inst_closeSession = new CloseSession(process.argv)

    const RenewalSession = require('./modules/api/renewalSession.js')
    const inst_renewalSession = new RenewalSession(process.argv)

    const StateSession = require('./modules/api/stateSession.js')
    const inst_stateSession = new StateSession(process.argv)

    const ChangePassword = require('./modules/api/changePassword.js')
    const inst_changePassword = new ChangePassword(process.argv)

    const ChangePasswordNext = require('./modules/api/changePasswordNext.js')
    const inst_changePasswordNext = new ChangePasswordNext(process.argv)

    const CheckSession = require('./modules/api/checkSession.js') 
    const inst_checkSession = new CheckSession(process.argv)
    
    cron.schedule('*/2 * * * *', () => {
      console.log('running a task every 2 minute');
      
      db.serialize(() => {
        
        let now = new Date().getTime()
        /*
        const   updatePreUser = db.prepare(`UPDATE preUsers SET finished = ? WHERE  endTiming < ? `)
                
                try{
                  updatePreUser.run(1, now)
                }catch(err){
                  console.log('1',err)
                }
                
                updatePreUser.finalize()

        const   deletePreUser = db.prepare(`DELETE FROM preUsers WHERE finished = ?`)
                try{
                  deletePreUser.run(1)
                }catch(err){
                  console.log('2',err)
                }  
                deletePreUser.finalize()


        const   updateTwoFaUser = db.prepare(`UPDATE twoFA SET finished = ? WHERE  endTiming < ? `)
                try{
                  updateTwoFaUser.run(1, now)
                }catch(err){
                  console.log('3',err)
                }
                updateTwoFaUser.finalize()

        const   deleteTwoFaUser = db.prepare(`DELETE FROM twoFA WHERE finished = ?`)
                try{
                  deleteTwoFaUser.run(1)
                }catch(err){
                  console.log('4',err)
                }
                deleteTwoFaUser.finalize()
        */
        //...
        /*
        const   updateSessionUser = db.prepare(`UPDATE session SET finished = ? WHERE  endTimingRenewal < ? AND noRenewSession = ?`)
                updateSessionUser.run(1, now, 1)
                updateSessionUser.finalize()
                
        */
        
        /*
        const   updateSessionUser = db.prepare(`UPDATE session SET finished = ? WHERE  endTimingRenewal < ?`)
                updateSessionUser.run(1, now)
                updateSessionUser.finalize()
                
        const   deleteSessionUser = db.prepare(`DELETE FROM session WHERE finished = ?`)
                deleteSessionUser.run(1)
                deleteSessionUser.finalize()
                */

      })
      


    });

    console.log('..')


    app.use(bodyParser.json());
    app.use(cors());
    
    let pathPublic=path.join(new Auth(process.argv).dirPathProject, 'public')
 
    app.use('/public', express.static(pathPublic))

    app.get('/api/stateSession',(req,res)=>{
      inst_stateSession.stateSession(req,res)
    })

    app.post('/api/renewSession', (req,res) => {
      
      inst_renewalSession.renewalSession(req,res)
      
    })

    app.post('/api/closeSession',(req,res)=>{
      inst_closeSession.closeSession(req,res)
    })

    app.post('/api/getCookies', (req,res) => {
      inst_cookies.getCookies(req,res)
    })


    app.post('/api/confirm2FA',(req,res)=>{
      inst_confirm2FA.confirm2FA(req,res)
    })

    app.post('/api/login',(req,res)=>{
      inst_login.login(req,res)
    })


    app.post('/api/signUp', (req,res) => {
        inst_signUp.signUp(req,res)
    })

    app.get('/api/confirmSignUp', (req,res) => {
      inst_confirmSignUp.confirmSignUp(req,res)
    })

    app.post('/api/changePassword', (req,res) => {
      inst_changePassword.changePassword(req,res)
    })

    app.post('/api/changePasswordNext',(req,res) => {
      inst_changePasswordNext.changePasswordNext(req,res)
    })

    app.post('/api/checkSession',(req,res) => {
      inst_checkSession.checkSession(req,res)
    })
    
    
    
    
    viewsRegister.forEach( view => {

      app.get(`${view.serviceName}/${view.fileName}`,(req,res) => {
        
        new views(process.argv)[view.serviceCore](req,res)
      
      })
    
    })
    
  
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })

}

main()