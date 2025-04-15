const { Socket } = require('./socket.js')


class Accumulator{

    constructor(){
        
        if(Accumulator.instance){   return Accumulator.instance }
        
        this.resolves = []
        this.promises = []
        this.result
        this.results = []
        this.totalResult
        
        Accumulator.instance = this
    }
    
    
    endSerie(callback,socket){
       
        
        
        Promise.all([...this.promises]).then(responses=>{
            
            responses.forEach( (response,index) => { 
                
                this.results.push(response)
                if(index==(this.promises.length-1)){
                    this.totalResult = this.results.every(response => response == true )
                        
                        socket.send(JSON.stringify({
                            type:'result',
                            responses: responses, 
                            totalResult: this.totalResult
                        }))

                        callback()
                    
                }  
            })
        })
        
       
            
        

    }

    end(callback){
        
        Promise.all(this.promises).then(result=>{
            
            this.result = result.every(response => response == true )
            
            if(this.result){ 
                callback() 
            }else{
              
            }      
                
        })
    
    }
    push(promise){
        this.promises.push(promise)
    }

}

exports.Accumulator = Accumulator