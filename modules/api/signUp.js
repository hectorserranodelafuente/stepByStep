const utils = require('./utilsAuth.js')
const Auth = require('./auth.js')
const logger = require('../logger/logger.js')
const Email = require('./email.js')

class SignUp extends Auth{
    
    constructor(processArgv){
        
        super(processArgv)
        
        
        this.email= new Email(processArgv)
        this.utils = new utils(processArgv)
        this.description = ''
        this.reportStructuredData = { validfilterNotNull:true, validfilterParticular:true }
        
    }


    signUp_Filter(req){

        /*
        ###############################
            FILTER WELL STRUCTURED DATA
        ###############################
        */
        let keysJson = Object.keys(req.body)
        
        
        if(!keysJson.length == 4 ){ 
            this.description = `not well structured data` 
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterNotNull = false
        }
        
        
        if(!Object.keys(req.body).includes('urlName')){
            this.description = `not attribute urlName on data or empty data on attribute urlName` 
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterNotNull = false
        }
        
        if(!Object.keys(req.body).includes('password')){
            this.description = `not attribute password on data or empty data on attribute password` 
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterNotNull = false
        }
        
        if(!Object.keys(req.body).includes('email')){
            this.description = `not attribute email on data or empty data on attribute email`  
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterNotNull = false
        
        }
        if(!Object.keys(req.body).includes('twoFA') && req.body.twoFA!==0){ 
            this.description = `not attribute twoFA on data or empty data on attribute twoFA`
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterNotNull = false 
        }

        if(!Object.keys(req.body).includes('typeTwoFA')){ 
            
            this.description = `not attribute typeTwoFA`
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterNotNull = false 
        
        }

        if(!Object.keys(req.body).includes('phoneNumber')){ 
            this.description = `not attribute phoneNumber`
            this.reportStructuredData.validfilterNotNull = false 
        }

        //################################################################################

        //################################################################################

        if(!this.utils.validate2FA(req.body['twoFA'])){ 
            this.description = `not valid 2FA`
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterParticular = false
        }

        if(!this.utils.validateUrlName(req.body.urlName)){
            this.description = `not valid url name` 
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterParticular = false
        }

        if(!this.utils.validatePswrd(req.body.password, 9, 20)){ 
            this.description = `not valid password`
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterParticular = false
        
        }
        
        if(!req.body.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){ 
            this.description = `not valid email`
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${this.description}` )
            this.reportStructuredData.validfilterParticular= false
        }
        
        
        if(!req.body.typeTwoFA!=='email'||req.body.typeTwoFA!=='sms'){
            this.description = `not valid typeTwoFA`
            this.reportStructuredData.validfilterParticular= false
        }
        
        
        
        if(!this.utils.validatePhoneNumber(req.body.phoneNumber)){
            this.description = `not valid phoneNumber`
            this.reportStructuredData.validatePhoneNumber = false
        }
        
        /*
        #################################
            END FILTER WELL STRUCTURED DATA
        ##################################
        */

    }

    each_1(err,row,index,res,reject){ 
        console.log('EACH_1') 
        if (err) {
            logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${err.message}` )
        }
        
        if(row.email) {
            if(index==0) {
            
            this.description = 'urlName has being choosen by another user or confirmation SignUp with this token is pending'
           
            res.json({action:0,status:'error', description:this.description})
            reject()
            index++
            }  
        }
    }
    each_2(err,row,index,res,reject){  
       
        if (err) {
           console.log(err)
            }
            
            if(row.email) {
            if(index==0) {
                this.description = `we have sent an email and is pending to confirm`
                
                res.json({ action:0,status:'error', description: this.description })
                reject()
                index++
            }  
        }

    }
    
    each_3(err,row,index,res,reject){  
        
        if (err) {
        console.error(err.message);
        }
        
        if(row.email){
            if(index==0) {
                this.description = `the user has being signUp before` 
                
                res.json({action:0, status:'error', description:this.description})
                
                reject()
                index++
            }
        }

    }

    
    signUp(req,res){
  
        let userNotInUsers = false
        let userNotInPreUsers = false
        let respuesta = res
        
            this.signUp_Filter(req)


                const sequence = new Promise((resolve,reject) =>{

                        if(!this.reportStructuredData.validfilterNotNull){
                        this.description = `Some attribute is empty null or not exist in data`
                        res.json({action:0,status:'error', description:this.description})
                        reject()

                        }
                        else if(!this.reportStructuredData.validfilterParticular){
                        res.json({action:0,status:'error', description:this.description})
                        reject()
                        }
                        
                        resolve()
                    
                
                    }).then((_response) =>{
                  
                    let scope = this
                    return new Promise((resolve,reject)=>{
                        this.db.serialize(() => {
                          
                            let index = 0
                            // 0 false 1 true
                            
                            this.db.each(`SELECT email FROM users WHERE name = "${req.body.urlName}" UNION SELECT email FROM preUsers WHERE name = "${req.body.urlName}" AND confirmed = 0`, (err, row) => {
                                if(err){
                                    console.log(err)
                                }
                                this.each_1(err,row,index,res,reject)
                            },(err)=> {
                                if(err){
                                    console.log(err)
                                }
                                
                                resolve() 
                            });
                        
                        });
                    })
                
                }).then( (response) => {  
                   
                    return new Promise((resolve,reject)=>{
                        this.db.serialize(() => {
                        let index = 0
                        
                        // 0 false 1 true
                        this.db.each(`SELECT email, confirmed FROM preUsers WHERE (email = ? AND confirmed = ?)`, [req.body.email,0], (err, row) => {
                            
                            this.each_2( err, row,index,res,reject)
                        },(err)=> resolve() );
                        
                        });
                    })
                    
                    }).then( _response => {
                
                    return new Promise((resolve,reject)=>{
                        this.db.serialize(() => {
                            let index = 0
                            this.db.each(`SELECT email FROM users WHERE email = ?`, [req.body.email], (err, row) => {
                                this.each_3(err,row,index,res,reject)
                            },(err)=> resolve() )
                            
                        })
                    })
                    }).then(_response=>{
                   
                    this.email.sendEmailConfirmationSignUp(req,res)

                    }).catch((err) => {
                    
                    logger.log( this.dirPathLogger, this.logsFileName, `/api/signUp error ${err}` )
                    });

                    }

                }


        

module.exports = SignUp