
const { Emulate, Mocker } = require('../../expect.js')
const SignUp = require('../../../modules/api/signUp.js')
const ConfirmSignUp = require('../../../modules/api/confirmSignUp.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../case.js')

    class SignUpCase2{
        
        constructor(index,end,callback){ 
            this.callback=callback
            this.case = new Case(index,end,callback)
            
        }   

    
    
    main(processArgv,socket){

        console.log('case 2','Trying to signUp a user, that has not being confirmed yet, it doesnt send a confirmation email')
        
        let req2 = {
            body:{
                urlName:'prueba1',
                password:'contrasena@2025',
                email:'prueba-1@mailinator.com',
                twoFA:1
            }
        }
        let scope=this
        let res2 = new Emulate('case 2','Trying to signUp a user, that has not being confirmed yet, it doesnt send a confirmation email','json',{
            action:0,
            status:'error',
            description:'urlName has being choosen by another user or confirmation SignUp with this token is pending'
        }, scope.case.resolves[scope.case.index],socket,1)

        console.log('------------',res2.json)
        let signUp2 = new SignUp(processArgv)
                        
        function mockEmail( req, res ){
            console.log('--',res)
            res.json({
                action:1,
                status:'ok',
                description:'Confirmation email sent, check your email'
            })
        }

        signUp2.email.sendEmail = mockEmail 
        
        signUp2.signUp(req2,res2)

        return this.case.promise
                
    }
}

    
module.exports = SignUpCase2