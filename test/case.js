
const {Accumulator} = require('./accumulator.js')

class Case extends Accumulator{
       
    constructor(index, end, callback, socket){
            
            super()
            
            this.socket = socket

            this.index = index

            this.end = end

            this.promise = new Promise((resolve,reject) => {

                this.resolves.push(resolve)
            
            })

            this.promises.push(this.promise)
            
             if(this.end){
                this.endSerie(callback, this.socket)
             }
            
             

    }

    finishTest(){
        return this.promise
    }
}
exports.Case=Case