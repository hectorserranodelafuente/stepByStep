
const Auth = require('./auth.js')
const logger = require('../logger/logger.js')

class Cookies extends Auth{

    constructor(processArgv){   
        super(processArgv)
        console.log('COOKIES AUTH DB::',this.db)
    }
    
    getCookies(req,res){
        console.log(1)
        console.log('______________',req.body.tokenSession)
        var startTimingRenewal
        const sequence = new Promise((resolve,reject)=>{
        this.db.serialize(() => {
            console.log(2)
            let index  = 0
            
            this.db.each(`SELECT COUNT(*),* FROM session WHERE tokenSession = ? AND finished = ?`, [req.body.tokenSession, 0], (err, row) => {
                console.log(3)
                if (err) { console.error(err.message); }
                console.log('==============>',row)
                if(row.startTimingRenewal){
                if(index==(row['COUNT(*)']-1)){
                    startTimingRenewal = row.startTimingRenewal
                    resolve(startTimingRenewal)
                    console.log('====>',startTimingRenewal)
                    index++
                    }
                }

                })
        
            })

        }).then(response=>{
            console.log(4)
            logger.log( this.dirPathLogger, this.logsFileName, `${new Date()} success sending cookies basicTwoFAtuh_1 ${response} basicTwoFAuth_2 ${req.body.tokenSession}` )
            
            res.cookie('basicTwoFAuth_0', new Date().getTime(), { maxAge: 24*60*60*1000, httpOnly:false});        
            res.cookie('basicTwoFAuth_1', response, { maxAge: 24*60*60*1000, httpOnly: false });
            res.cookie('basicTwoFAuth_2', `${ req.body.tokenSession }` , { maxAge: 24*60*60*1000, httpOnly: false });
            res.send({ action: 0, status:'success', description:'Cookies were successfully sent' })

        })
    
    
    
    
    
    }
}

module.exports = Cookies