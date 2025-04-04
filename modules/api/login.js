const utils = require('./utilsAuth.js')
const Auth = require('./auth.js')
const logger = require('../logger/logger.js')
const Email = require('./email.js')
const { createHmac } = require('node:crypto')
const nodemailer = require('nodemailer')

class Login extends Auth{

    constructor(processArgv){
        
        super(processArgv)
        this.email = new Email(processArgv)
        this.utils = new utils(processArgv)
        console.log('LOGIN AUTH DB::',this.db)
    }

    each_1(){

    }
    
    each_2(){

    }

    each_3(){

    }

    each_4(){

    }

    each_5(){


      
    }

    login(req,res){

        let sequence = new Promise((resolve,reject) => {
            console.log('######## login 1')
            this.db.serialize(() => {
              let index = 0
              // 0 false 1 true
              this.db.each(`SELECT email, addition FROM users WHERE (email = ?)`, [req.body.email], (err, row) => {
                
                if (err) {
                  console.error(err.message)
                  reject()
                }
                
                if(row.email) {
                  if(index==0) {
                    resolve(row)
                    index++
                  }  
                }
      
              },(err)=> reject());
            
            });
          })
          .then(response => {
            console.log('########### login 2',response)
            
            // Mirar si la password coincide...
            console.log('se han encontrado coincidencias, miramos si el usario tiene 2FA activado',response['addition'])
            let _password = createHmac('sha256',response['addition']).update(req.body.password).digest('hex');
            console.log(_password)
            // db.serialize...
            return new Promise((resolve,reject) => {
              this.db.serialize(() => {
                let index = 0
                // 0 false 1 true
                this.db.each(`SELECT email,twoFA FROM users WHERE (email =?) AND (password=?)`, [req.body.email,_password], (err, row) => {
                  if (err) {
                    console.error(err.message)
                    reject()
                  }
                  console.log(row)
                  if(row.email) {
                    if(index==0) {
                      console.log(row)
                      resolve(row)
                      index++
                    }  
                  }
                
                },(err=>reject()))
              })  
            })
      
            
                  //...
          }).then( response =>{
            console.log('########### login 3')
            console.log('miramos si el usuario tiene una session iniciada ',response.twoFA)
            console.log('****************************************', response)
            return new Promise((resolve,reject) => {
                this.db.serialize(() => {
                  let index = 0
                  // 0 false 1 true
                  this.db.each(`SELECT tokenSession, COUNT(*) FROM session WHERE email = ? AND finished != ? `, [req.body.email,1], (err, row) => {
                    if (err) {
                      //console.error(err.message)
                      reject()
                    }
                    //console.log(row)
                    if(row.email) {
                      if(index == (row['COUNT(*)']-1)) {
                        console.log(row)
                        resolve({ twoFA: response.twoFA, tokenSession: row.token.session})
                        index++
                      }  
                    }
                  
                  },(err=>resolve({ twoFA: response.twoFA, tokenSession: null})))
                })  
              })
            
            }).then(response=>{
              console.log('########### login 4')
              console.log('===>',response)
            if( response.twoFA == 0 && response.tokenSession){ 
                //logger.log( this.dirPathLogger, this.logsFileName, `/login Success: Session was initiated before: Redirect to init` )
                res.json({ action:0, status:'success', tsession:response.row.tokenSession, actionDescription:'Redirect to init' })
            }
            
            if( response.twoFA == 0 && !response.tokenSession ){
              
              
              // Inicializa session con un nuevo token
              let newToken = this.utils.generateToken(this.tokensLength)
              let email = req.body.email
              let startTiming = new Date().getTime() 
              let endTiming = new Date().getTime() + this.periodExpiring2FA
              let notRenewSession = 0

              let startTimingRenewal = endTiming
              let endTimingRenewal = startTimingRenewal + this.periodRenewalSession
              
              //...
              this.db.serialize(() => {
                //########################## INSERT INTO session ##############################
                try{
                const insertionSession = this.db.prepare(`INSERT INTO session VALUES (?,?,?,?,?,?,?,?)`)
                      insertionSession.run( newToken, email, startTiming, endTiming, notRenewSession, startTimingRenewal, endTimingRenewal,0)
                      insertionSession.finalize()
                }catch(err){
                  console.log(err)
                }
              })
              //logger.log( this.dirPathLogger, this.logsFileName, `/login Success: Session initiated: Redirect to init` )
              console.log('4.1')
              res.json({ action:0, tsession:newToken, description:'Redirect to init'})
            } 
      
            if(response.twoFA == 1 && response.tokenSession){
              //...
              //logger.log( this.dirPathLogger, this.logsFileName, `/login Success: Session initiated so we dont need to insert code on 2FA` )
              res.json({ action:0, tsession:response.row.tokenSession, description:'Redirect to init' })
            }
      
            if(response.twoFA ==1 && !response.tokenSession){
              //console.log('**********************************************')
              // we add register 2FA
              // send confirmation email with code
              // show input code instead in basic login
              // ...
              // ...
              // ...
              let intervalExpiredTiming = this.periodExpiring2FA
              let tokenTwoFASession = this.utils.generateToken(this.tokensLength)
              let code = this.utils.generateToken(this.code2FALength)
              let _try = 0
              let finished = 0
              let email = req.body.email
              let startTiming = new Date().getTime()
              let endTiming = new Date().getTime()+intervalExpiredTiming
              let confirmed = 0 
              let finishReason = ""
              try{
                /*
                console.log('----------',tokenTwoFASession)
                console.log('----------',code)
                console.log('---------',_try)
                console.log('---------',finished)
                console.log('---------',email)
                console.log('---------',startTiming)
                console.log('---------',endTiming)
                console.log('---------',confirmed)
                console.log('---------',finishReason)
                console.log('db .',this.db)
                */
                this.db.serialize(() => {
                
                  const insertionTwoFA= this.db.prepare(`INSERT INTO twoFA VALUES (?,?,?,?,?,?,?,?,?)`)
                  
                  insertionTwoFA.run(
                    tokenTwoFASession, 
                    code,
                    _try, 
                    finished, 
                    email, 
                    startTiming, 
                    endTiming, 
                    confirmed,
                    finishReason)
                 
                
                  
                  insertionTwoFA.finalize()

                  //this.db.each("SELECT * FROM twoFA", (err, row) => { console.log(' row -> ',row); });
              })
              //console.log('*********************************************')
            }catch(err){
              console.log(err)
            }
              
              let scope = this
              console.log('sendEmailconfirmation...', tokenTwoFASession)
              scope.email.sendEmailConfirmation2FA(req,res,code,tokenTwoFASession)
            
            } 
          }).catch( error => {
            console.log('########### login 5')
            console.log('3',error)
            //logger.log( this.dirPathLogger, this.logsFileName, `/login ERROR: wrong user or password` )
            res.json({action:2, status:'error', description:'wrong user o password'})
          })
    
    
    
    
    
    }
}

module.exports = Login