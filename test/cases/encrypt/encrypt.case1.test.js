
const { Emulate, Mocker } = require('../../expect.js')
const {Accumulator} = require('../../accumulator.js')
const { Case }  = require('../../case.js')
const { Socket } = require('../../socket.js')
const   UtilsAuth  = require('../../../modules/api/utilsAuth.js')
const crypto = globalThis.crypto;

const {
    scrypt,
    randomFill,
    createCipheriv,
  } = require('node:crypto');


class EncryptPassword{

    constructor( index, end, callback, socket){
        
        this.case = new Case( index, end, callback, socket )
        this.callback = callback
    }

    testCipher( processArgv, res, ...args ){
        
        let scope = this

        new UtilsAuth(processArgv)
            .aesEncrypt(args)
            .then( ( response ) => {
                
                const { key, iv, ciphertext } = response
                // console.log('key ',key)
                // console.log('iv ',iv)
                // console.log('ciphertext', ciphertext)
                return new UtilsAuth(processArgv).aesDecrypt(ciphertext,key,iv)

            }).then( (_response) => {
                // console.log('_response',_response)
                res.json({  decryptedPassword: _response })

            })
    
    }

    main(processArgv,socket) {
        //...
        let toBeEncrypted = 'contrasena@2025' 
        let scope = this
        
        let res = new Emulate(
            'case 23',
            'TestCipher "Encrypted" parameter equal to function response \n',
            'json',
            {   
                decryptedPassword: toBeEncrypted  
            },
            scope.case.resolves [  
                scope.case.index 
            ],
            socket,
            22)
            
            

            let args = [
                toBeEncrypted
            ]
            
            scope.testCipher( processArgv, res, ...args )
                
    }

}

module.exports = EncryptPassword

