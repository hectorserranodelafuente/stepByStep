
const Auth = require('../api/auth.js')
const logger = require('../logger/logger.js')
class Views extends Auth{

    constructor(processArgv){
        super(processArgv)
    }

    checkSession(req,res){
        
        let queryTokenSession = true
        if(!req.query.tokenSession){ queryTokenSession = false  }
        
        return new Promise((resolve, reject) => {
            
            if(!queryTokenSession){  reject({description:'not tokenSession provided'})  }
            
                this.db.serialize(() => {
                
                
                
                console.log(req.query.tokenSession)
                this.db.serialize(()=>{
                    let index = 0
                this.db.each(`SELECT * FROM session WHERE tokenSession = ? AND finished = ?`, [req.query.tokenSession,0], (err, row) => {
                
                    if (err) {  reject(err) }
                
                    if(row.email) {
                       
                        if(index==0) {
                            
                            resolve({ closed: false })
                            index++
                        }  
                    }
                
                },(err => {
                    
                    resolve({ closed: true, description:'not session found' })
                    
                    }))

                })
            })
        
        })


    }

    init(req,res){

        res.sendFile(`${this.dirPathProject}/public/views/init.html`)
        
        /*
        this.checkSession(req,res).then(response=>{
            if(!response.closed){
                res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/init.html`)
            }
        }).catch(err=>{
            res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/notSessionFound.html`)
        })
        */

    }

    
    basicSignUp(req,res){
        res.sendFile(`${this.dirPathProject}/public/views/basicSignUpForm.html`); 
    }

    basicLogin(req,res){
        res.sendFile(`${this.dirPathProject}/public/views/basicLoginForm.html`); 
    }

    basicStart(req,res){
        res.sendFile(`${this.dirPathProject}/public/views/startIndex.html`)
    }

    forgottenPasswordStepOne(req,res){
        res.sendFile(`${this.dirPathProject}/public/views/forgottenPasswordStepOne.html`)
    }

    forgottenPasswordStepTwo(req,res){
        res.sendFile(`${this.dirPathProject}/public/views/forgottenPasswordStepTwo.html`)
    }
    
}

module.exports = Views