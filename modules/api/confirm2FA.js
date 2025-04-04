
const utils = require('./utilsAuth.js')
const Auth = require('./auth.js')
const logger = require('../logger/logger.js')

class Confirm2FA extends Auth {

    constructor(processArgv){
        super(processArgv)
        this.utils = new utils(processArgv)
        console.log('CONFIRM2FA AUTH DB::',this.db)
    }
    
    confirm2FA(req,res){
        
        console.log('-------------------------')
        console.log( req.body.tokenTwoFASession)
        console.log( req.body.code )
        console.log('-------------------------')
        
        let sequence = new Promise((resolve,reject)=>{
            
            this.db.serialize(() => {
            let index = 0
            // 0 false 1 true
            console.log('-------------------------->',req.body.tokenTwoFASession)
            this.db.each(`SELECT email, try, finished, code, finishReason FROM twoFA WHERE tokenTwoFASession = ?`, [ req.body.tokenTwoFASession], (err, row) => {
                if (err) {
                console.error('=>',err.message)
                reject()
                }
                // console.log(row)
                if(row.email) {
                    if(index==0) {
                        resolve({ 
                            token2FActiveSession: req.body.tokenTwoFASession, 
                            code:row.code, 
                            email: row.email, 
                            try: row.try, 
                            finished: row.finished, 
                            finishReason:row.finishReason 
                        })
                        index++
                    }  
                }
            
            },(err=>reject({ action:0, error:'Session Deleted'})))
            })
        
        }).then((response)=>{

            return new Promise((resolve,reject)=>{
                
            let errorMessage=''
            let _try = response.try+1  

            if(response.finished==1){
                
                errorMessage='session Finished'
                reject({ action:1, error:errorMessage})
            
            }else{

                if( response.code !== req.body.code){
                //console.log('[[[[[[[[[',response.code)
                //console.log('[[[[[[[[[', req.body.code)
                        // Default values
                        let finished = 0
                        let finishReason = ''
                        let action = 2
                        let errorMessage = 'try failed'
                        
                
                        if(_try > this.tryEstablishedByDefault){     

                            finished = 1
                            finishReason = "tryesExceed"
                            errorMessage = 'Have being exceed the number of tryes'
                            action = 3
                        }


                        this.db.serialize(() => {
                            const updatePreUser2 = this.db.prepare(`UPDATE twoFA SET try = ?, finished=?, finishReason = ? WHERE tokenTwoFASession = ?`)
                                updatePreUser2.run( _try, finished, finishReason, response.token2FActiveSession)
                                updatePreUser2.finalize()
                        
                        })

                        reject({ action:action, error:errorMessage})

                    }else{
                    
                    if(_try > this.tryEstablishedByDefault){     
                        errorMessage = 'Have being exceed the number of tryes'
                        action = 3
                        reject({ action:action, error:errorMessage})
                    }
                    
                    resolve(response)

                    }
                }
            



            })

            }).then( response => {
            
                    // Init session in session table with new register
                    let tokenSession = this.utils.generateToken(this.tokensLength)
                    let startTiming = new Date().getTime() 
                    let endTiming = new Date().getTime() + this.periodExpiringSession
                    let notRenewSession = 0

                    let startTimingRenewal = endTiming
                    let endTimingRenewal = startTimingRenewal + this.periodRenewalSession
                    
                    console.log("starTimingRenewal________________", startTimingRenewal)
                    console.log("endTimingRenewal_________________", endTimingRenewal)

                    let finished = 0
                    let _try = response.try+1
                    

                    
                    this.db.serialize(() => {
                        
                        //########################## INSERT INTO session ##############################
                        const insertionSession = this.db.prepare(`INSERT INTO session VALUES (?,?,?,?,?,?,?,?)`)
                            insertionSession.run( tokenSession, response.email, startTiming, endTiming, notRenewSession, startTimingRenewal, endTimingRenewal, finished)
                            insertionSession.finalize()
                        
                        const updatePreUser = this.db.prepare(`UPDATE twoFA SET try = ?, confirmed = ?, finished = ?, finishReason = ? WHERE tokenTwoFASession = ?`)
                            updatePreUser.run( _try, 1, 1, "sessionConfirmed",response.token2FActiveSession)
                            updatePreUser.finalize()

                    
                        
                        
                    })

                    logger.log( this.dirPathLogger, this.logsFileName, `/confirm2FA SUCCESS redirecTo init` )
                    res.json({ action:4, status:'success', tokenSession:tokenSession, description:'Redirect to init' })
                        
                
                
            }).catch(err=>{
            console.log('===============>',err)
                logger.log( this.dirPathLogger, this.logsFileName, `/confirm2FA ERROR Something went wrong` )
                res.json({ action:err.action, status:'error', error:`Something went wrong`, description:err.error})
            }) 

    
    
    
    
    }
}

module.exports = Confirm2FA