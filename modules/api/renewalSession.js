const Auth = require('./auth.js')

class RenewalSession extends Auth {

    constructor(processArgv){
        super(processArgv)
        console.log('RENEWAL SESSION AUTH DB::',this.db)
    }   

    renewalSession(req,res){

        console.log('-----------------')
        console.log( `/renewalSession` )
        console.log( `tokenSession `, req.body.tokenSession )
        console.log('-----------------')
        
        let now = new Date().getTime()

        let sequence = new Promise((resolve,reject) => {
        
                    this.db.serialize(() => {
                    
                    let index = 0
                    
                    // Rescue from config
                    // Change
                    let periodTimingSession =   this.periodExpiringSession
                    let periodTimingRenewalSession = this.periodRenewalSession
                    
                    let onRenewalTime = false
                    let newStartTiming
                    let newEndTiming
                    let newStartTimingRenewal
                    let newEndTimingRenewal
                    try{
                        this.db.each(`SELECT * FROM session WHERE tokenSession = ? AND finished = ?`, [req.body.tokenSession,0], (err, row) => {
                            
                            if (err) { console.error(err.message); reject();}
                            
                            if(row.startTiming){
                            
                            if(index==0) {
                                console.log('renewalSession: 1.sequence')
                                
                                if(now >= row.startTimingRenewal && now <= row.endTimingRenewal ){
                                onRenewalTime = true
                                console.log(':::::onRenewalTime::::::',now)
                                console.log(row.startTimingRenewal)
                                console.log('-')
                                console.log(row.endTimingRenewal)
                                } 
                                
                                newStartTiming = now 
                                newEndTiming = now + periodTimingSession
                                newStartTimingRenewal = newEndTiming 
                                newEndTimingRenewal = newEndTiming+periodTimingRenewalSession
                                resolve({ 
                                    onRenewalTime:onRenewalTime,
                                    newStartTiming:newStartTiming, 
                                    newEndTiming:newEndTiming,
                                    newStartTimingRenewal:newStartTimingRenewal,    
                                    newEndTimingRenewal:newEndTimingRenewal
                                })
                                
                                }
                                
                                index++
                            }  
                            },(_res)=> reject({description:'no active session found'}));

                    }catch(err){ reject({description:'some error happened'}) }
                    
                    });

        }).then( response => {
            
            return new Promise((resolve,reject) => {
                
            if(response.onRenewalTime){
                console.log('2')
                try{
                    this.db.serialize(() => {  
                    
                    const updateSession = this.db.prepare(`UPDATE session SET startTiming = ?, endTiming = ?, startTimingRenewal = ?, endTimingRenewal = ? WHERE tokenSession=?`)
                          updateSession.run( response.newStartTiming, response.newEndTiming, response.newStartTimingRenewal, response.newEndTimingRenewal, req.body.tokenSession )
                          updateSession.finalize()
                          console.log('3')
                          resolve({status:'success', description:'session renewed',db:response})
                
                    })
                }catch(err){
                    console.log('4')
                    reject({status:'error', description:'some error happened on updating session' })
                
                }
                
            }else{
                reject({description:'not in renewal'})
            }

            })


            }).then(response=>{
            
            //console.log('5')
            res.cookie('basicTwoFAuth_0', new Date().getTime() , { maxAge: 24*60*60*1000, httpOnly: false })
            res.cookie('basicTwoFAuth_1', response.db.newStartTimingRenewal, { maxAge: 24*60*60*1000, httpOnly: false });
            
            //referenceNow helps to avoid problems of syncronization between frontend and backend
            res.json({ action: 0, description:response.description })
            logger.log( this.dirPathLogger, this.logsFileName, `${new Date()} success renewing session ${response.db.newStartTimingRenewal}` )

            
            return
            console.log(':::::::::::::::::::::::::::::::::::::::::::::::::')
            
            }).catch(err=>{ 
            //console.log('6')
            res.json({ action: 1, description:err.description})
            logger.log( this.dirPathLogger, this.logsFileName, `wrong renewal session` )
            

            })




    }



}

module.exports = RenewalSession