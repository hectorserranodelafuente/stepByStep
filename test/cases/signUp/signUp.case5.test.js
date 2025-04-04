
const { Emulate, Mocker } = require('../../expect.js')
const SignUp = require('../../../modules/api/signUp.js')
const ConfirmSignUp = require('../../../modules/api/confirmSignUp.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../case.js')
const { Socket } = require('../../socket.js')

    class SignUpCase5{
        
        constructor(index,end,callback){ 
              
            this.case = new Case(index,end,callback)
            
            /*this.socket = new Socket() 
            setTimeout(function(){
                console.log('SOCKET ',this.socket.socket)   
            },3000)*/
            this.callback = callback
        
        }   

    

    main(processArgv,socket){
            console.log('main case 1')
                let req1 = {
                    body:{
                        urlName:'prueba2',
                        password:'contrasena@2025',
                        email:'prueba-2@mailinator.com',
                        twoFA:1
                    }
                }
                let scope = this
                console.log('scope',scope.case.resolve)
                let res1 = new Emulate('case 5','When we introduce a second register the data is all right and it is sent a confirmation email',
                    'json',
                    {
                        action:1,
                        status:'ok',
                        description:'Confirmation email sent, check your email'
                    }, scope.case.resolves[scope.case.index],socket,4)
                
               
                //reset().then(response=>{
                    console.log('RESET DB DONE')
                    let signUp1 = new SignUp(processArgv)
                        
                        function mockEmail(req,res){
                            
                            res.json({
                                action:1,
                                status:'ok',
                                description:'Confirmation email sent, check your email'
                            })
                            
                        }

                        signUp1.email.sendEmail = mockEmail 
                    
                        signUp1.signUp(req1,res1)
                //})

                return this.case.promise
    }
}

    
module.exports = SignUpCase5