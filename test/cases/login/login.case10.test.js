


const { Emulate, Mocker } = require('../../expect.js')
const Login = require('../../../modules/api/login.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../case.js')
const { Socket } = require('../../socket.js')


class LoginCase10 {

    constructor( index, end, callback, socket ){

        this.case = new Case( index, end, callback, socket)
        this.callback = callback

    }

    main( processArgv, socket ){

        let req5 = {    
            body:{  
                email:'prueba-1@mailinator.com', 
                password:'contrasena@2026' 
            }
        }
        
        let scope = this
      
        function mockEmail(req,res){
            res.json({
                action:0,
                description:'redirect to init'
            })
        }
        
        let res5 = new Emulate(
            `case 22`,
            `We login with a user that has change password before so we introdoce respective password,`,
            'jsonContains',
            {
                action:0,
                description:'Redirect to init'
            },
            scope.case.resolves[scope.case.index],
            socket,
            21)
        
        
        let login5 =  new Login(processArgv)
        
        login5.email.sendEmail = mockEmail

        login5.login(req5,res5)

        return this.case.promise

    }
}

module.exports= LoginCase10
    