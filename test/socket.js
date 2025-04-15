
const WebSocket= require('ws')
console.log('Websocket', WebSocket)

class Socket{
    
    constructor() {
        this.socket
        this.port = 8000
        
        if(!Socket.instance){
            this.server = new WebSocket.Server({port:this.port})

        }
        this.server.on('connection',(socket)=>{ 
            this.socket = socket
        
        })
    }
    

}

exports.Socket=Socket