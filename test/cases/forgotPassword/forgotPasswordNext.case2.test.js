const ChangePasswordNext = require('../../../modules/api/changePasswordNext.js')
const { Emulate, Mocker } = require('../../expect.js')
const Login = require('../../../modules/api/login.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../case.js')
const { Socket } = require('../../socket.js')

class forgotPasswordNext2{

    constructor(index, end, callback, socket){  
        
        this.case = new Case(index,end,callback,socket)
        this.callback = callback

    }
    
    auxRecoverToken(email,processArgv){
        console.log(processArgv)
        console.log(' email ',email)
        let db = new Auth(processArgv).db
        return new Promise((resolve,reject)=>{
            let sql = `SELECT tokenChangePasswordSession, COUNT(*) FROM changePassword WHERE email = ?`
            
            console.log(`--SQL--`,sql)
            
            db.serialize(() => {
            
                db.each( sql, [email], (err,row) => {
                    if(row){
                        if(row.tokenChangePasswordSession){
                            
                            resolve(row.tokenChangePasswordSession)
                        
                        }
                    }
                
                },(err)=>{
                    resolve(null)
                })

            })
        })
    
    
    }

    main( processArgv, socket ){
        //console.log(':::::::::::::',processArgv)
        let email = 'prueba-1@mailinator.com'

        let scope = this 

        let req = {
            
            body:{
                
                tokenChangePasswordSession: null,  
                
                password: 'contrasena@2026',
                
                twoFA: 0

            }

        }
        
        let res = new Emulate(
            `case 21`,
            `Through second changePassword \n`+
            `step makes effective a successfull change of user data \n`,
            'json',
            {
                
                action:1,
                status:'success',
                description:'It was possible to change user data'

            },
            scope.case.resolves[ scope.case.index ],
            socket,
            20)
            
        
        //...
        //console.log('PROCESSARGV...',processArgv)
        this.auxRecoverToken(email,processArgv).then( (response) => {
            
            req.body.tokenChangePasswordSession = response
            
            console.log(`-- response --`, response)
            
            new ChangePasswordNext( processArgv ).changePasswordNext(req,res) 
            
        })
        
        
    }

}

module.exports = forgotPasswordNext2