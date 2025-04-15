const {Accumulator}= require('./accumulator.js')

class Expect {

    constructor( caseName, caseDescription){
      
        this.caseName = caseName
        this.caseDescription =   caseDescription
        this.accumulator = new Accumulator()
    }
    
    equal(response,expectedResponse){ 
        return (JSON.stringify(response) === JSON.stringify(expectedResponse))
    }

    contains(response,expectedResponse){
        return response.includes(expectedResponse)
    }

    jsonContains( response, expectedResponse){
        
        return Object.keys(expectedResponse).every( key => {
            return expectedResponse[key] === response[key]
        })
    }
    
    store(response,typeResponse,expectedResult,resolve, socket,index) {   
        
        if(typeResponse == "jsonContains"){
            this.valid = this.jsonContains(response,expectedResult)
        }
        
        if(typeResponse=="json"){
           
            this.valid = this.equal(response, expectedResult) 
        }
        if(typeResponse=="html"){
            this.valid = this.contains(response,expectedResult)
        }
        
        
        socket.send(JSON.stringify({
            type:'case', 
            case: this.caseName,
            caseDescription: this.caseDescription,
            typeResponse: typeResponse, 
            response: response,
            expectedResult: expectedResult,
            valid: this.valid
        }))
        
    
        this.accumulator.resolves[index](this.valid)
        
    }
}


class Emulate extends Expect{

    constructor(caseName,caseDescription,typeResponse,expectedResult,_resolve, socket,index){
        super(caseName)
        
        this.resolve
        let scope = this
        this.emulatedResponse = new Promise((resolve,reject)=> { 
                                    scope.resolve = resolve 
                                })

        this.emulatedResponse.then( response => { 
            
            new Expect(caseName,caseDescription).store(response,typeResponse,expectedResult,_resolve,socket,index) 
        })
    
    }

    json(response){
      
        this.resolve(response) 
    
    }

    send(response){
        this.resolve(response)
    }
}

class Mocker {

    constructor( _function, _mock){
      this._function = _function
      this._mock = _mock 
    }


    go(err,row){ 
        return (!this.on) ? this._function.call(null,...args) : this._mock().call(null,...args) 
    }
    
}


exports.Emulate=Emulate