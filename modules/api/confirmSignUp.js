const Auth = require('./auth.js')
const logger = require('../logger/logger.js')
const ejs = require('ejs')
const path = require('path')

class ConfirmSignUp extends Auth{

        constructor(processArgv){

            super(processArgv)
            console.log('CONFIRMSIGNUP AUTH DB::',this.db)

        }

        confirmSignUp(req,res){
            //console.log(req.query.ts)
            const sequence = new Promise( (resolve, reject) =>{
                //console.log(1)
                if(!req.query.ts){
            
                  const templatePath = path.join(__dirname,'../../public/ejs/confirmSignUpGenericError.ejs');
                  const data = {};
            
                  let html = ejs.renderFile(templatePath, data, (err, str) => {
                      if (err) {
                        console.error('Error al renderizar el template:', err);
                      } else {
                        res.send(str)
                        console.log('Template renderizado con éxito:', str);
                      }
                      reject()
                  });
              
                }else{
                  resolve(res)
                } 
                
              }).then( response => {
                //console.log(2)
                return new Promise((resolve,reject)=>{
                this.db.serialize(() => {
                  
                  let index = 0
                  this.db.each(`SELECT * FROM preUsers WHERE (tokenPreUsers = ? AND confirmed = ?)`, [req.query.ts,0], (err, row) => {
                  if (err) {
                    console.error(err.message);
                    reject()
                  }
                  console.log('row => ',row)
                  if(row.email){
                    if(index==0){
                        
                        const insertionUser = this.db.prepare(`INSERT INTO users VALUES (?,?,?,?,?)`)
                        insertionUser.run(row.email,row.name,row.password, row['twoFA'],row.addition)
                        insertionUser.finalize()
                      
                        console.log('::')
                        const updatePreUser = this.db.prepare(`UPDATE preUsers SET confirmed=?,finished=? WHERE tokenPreUsers=?`)
                        updatePreUser.run(1, 1,req.query.ts)
                        updatePreUser.finalize()
                        console.log('::')
                        //logger.log( dirPathLogger, logsFileName, `` )
                      
                        const templatePath = path.join(__dirname,'../../public/ejs/confirmSignUpSuccess.ejs');
                        const data = { email: row.email };
            
                        let html = ejs.renderFile(templatePath, data, (err, str) => {
                            if (err) {
                              console.error('Error al renderizar el template:', err);
                            } else {
                              res.send(str)
                              console.log('Template renderizado con éxito:', str);
                            }
                            reject()
                          });
                        
                        index++
                      }    
                  }
                },(err)=> resolve(res));
                })
              })
            
              }).then(response=>{
                //console.log(3)
                logger.log( this.dirPathLogger, this.logsFileName, `` )
                
                const templatePath = path.join(__dirname,'../../public/ejs/confirmedBeforeSignUp.ejs');
                const data = {};
            
                let html = ejs.renderFile(templatePath, data, (err, str) => {
                    if (err) {
                      console.error('Error al renderizar el template:', err);
                    } else {
                      res.send(str)
                      console.log('Template renderizado con éxito:', str);
                    }
                    
                  });
                
                //res.json({status:'error',error:'user signUp has being confirmated before or time to confirm has expired'})
            
              }).catch( err => {
                //console.log(4)
                //res send html
                logger.log( this.dirPathLogger, this.logsFileName, `` )
                console.log( 'reject!!!' )
                console.log( err ) 
              })
            
            }



        }


module.exports = ConfirmSignUp