const mail = require('.././envMail.js')
const readline = require('readline')
const utils = require('../modules/api/utilsAuth.js')
const { StringDecoder } = require('node:string_decoder')
const path = require('path');
const decoder = new StringDecoder('utf8')
const fs = require('fs')


//console.log('utils ',utils)

function arrayBufferToHex(arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    return Array.from(byteArray)
      .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to hex and pad to 2 digits
      .join(''); // Join all hex values into a single string
}

  function hexToArrayBuffer(hex) {
    const byteArray = new Uint8Array(
      hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)) // Divide el string en pares y los convierte a enteros
    );
    return byteArray.buffer; // Devuelve el ArrayBuffer correspondiente
  }
  
async function introduceUser(rl){
    return new Promise((resolve,reject)=>{
        rl.question('Introduce User: ', ( response ) => {
            resolve( response )
        })
    })
}


async function introducePassword(rl){
    return new Promise((resolve,reject)=>{
        rl.question('Introduce Password: ', ( response )  => {
            resolve( response )
            rl.close()
        });
    })

}
async function main(processArgv){
    if( !mail.pass ){    
        
        const stdin = process.stdin
        const stdout = process.stdout

        const rl = readline.createInterface({input: stdin, output: stdout})

        stdin.on('data', (char)=>{
                
            const charCode = char.toString().charCodeAt(0)
            
            if(charCode === 13){
                return
            }else if(charCode<32||charCode>126){
                return
            }else{
                // stdout.write('*') 
            }
        })

        function encryptElement(el,prefix){
            
            console.log( `  el  `, el )

            let index = 0
            let encryptedCipherText

            for(var i in el){

                if( index == 2 ){
                    encryptedCipherText = arrayBufferToHex(el[i])
                }

                index++
            }
            
    
            let { dataKey, iv } = el
            
            let v = JSON.stringify(iv)
            
            let bufferIv = Buffer.from(v)
            let bufferIvString = bufferIv.toString('hex')
            
            let dataKeyStringify = JSON.stringify(dataKey)

            
            let dataKeyEncrypted = Buffer
                                    .from( dataKeyStringify )
                                    .toString('hex')
            
            
                
            fs.writeFileSync( path.join(__dirname,'..',`./confEmail/${prefix}DataKey.txt`), dataKeyEncrypted, { encoding: 'utf8' })
            fs.writeFileSync( path.join(__dirname,'..',`./confEmail/${prefix}CipherText.txt`), encryptedCipherText, { encoding: 'utf8' } )
            fs.writeFileSync( path.join(__dirname,'..',`./confEmail/${prefix}Iv.txt`), bufferIvString, { encoding: 'utf8' } )

        }

        let user = await introduceUser(rl)
        let password = await introducePassword(rl)     

       
        
        let userEncrypted = await new utils(processArgv).aesEncrypt(user)
        let passwordEncrypted = await new utils(processArgv).aesEncrypt(password)

        
        encryptElement( userEncrypted, 'user')
        encryptElement( passwordEncrypted, 'password')
       
    }   
            
}



main(process.argv)