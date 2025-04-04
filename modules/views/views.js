
const Auth = require('../api/auth.js')
const logger = require('../logger/logger.js')
class Views extends Auth{

    constructor(processArgv){
        super(processArgv)
    }

    checkSession(req,res){
        console.log('=====>',req.query.tokenSession)
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
                        console.log('row-',row)
                        if(index==0) {
                            console.log('####')
                            resolve({ closed: false })
                            index++
                        }  
                    }
                
                },(err => {
                    console.log('####')
                    resolve({ closed: true, description:'not session found' })
                    
                    }))

                })
            })
        
        })


    }

    init(req,res){
        //structure similar to all views with exception of basicSignUp, basicLogin, basicStart
        this.checkSession(req,res).then(response=>{
            if(!response.closed){
                res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/init.html`)
            }

        }).catch(err=>{
                res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/notSessionFound.html`)
        })

    }

    
    basicSignUp(res){
        res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/basicSignUpForm.html`); 
    }

    basicLogin(req,res){
        res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/basicLoginForm.html`); 
    }

    basicStart(req,res){
        res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/startIndex.html`)
    }

    forgottenPasswordStepOne(req,res){
        res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/forgottenPasswordStepOne.html`)
    }

    forgottenPasswordStepTwo(req,res){
        res.sendFile(`${this.dirPathProject}/public/${this.frontTech}Views/forgottenPasswordStepTwo.html`)
    }
    
}

module.exports = Views