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
    
    //in serie
    endSerie(callback,socket){
        
        // console.log('El resultado deberia ser 4',this.promises.length)
        // console.log('CALLBACK',callback)

        // Abre el archivo HTML en Chrome
        
        
        Promise.all([...this.promises]).then(responses=>{
            // console.log('---------------RESOLVED ALL---------------------------',this.promises)
            responses.forEach( (response,index) => { 
                // console.log('-response-',response)
                this.results.push(response)
                if(index==(this.promises.length-1)){
                    this.totalResult = this.results.every(response => response == true )
                    
                        console.log("TOTALRESULT: ", this.totalResult)
                        
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

    
    //in paralel
    end(callback){
        console.log('----this.promises----',this.promises)
        Promise.all(this.promises).then(result=>{
            console.log('-------------------------------------------')
            console.log('-------------------------------------------',result)
            console.log('-------------------------------------------')
            this.result = result.every(response => response == true )
            console.log("RESULT: ", this.result)
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