
//-----------------------------------------

let idList = [ 'messageStatusSuccess', 'messageStatusError' ]

function close(id){ document.getElementById(id).className = 'hidden' }
function insertMessage(id, message, time){

    let el = document.getElementById(id)
    
    el.className = 'showed'
    el.innerHTML = message
    
    setTimeout(function(){
        
        el.className = 'hidden'
        el.innerHTML = message
     
    },time)
    
    // Close the rest
    idList.filter(_id => {
        return ( _id !==id ) 
    }).forEach(el => {
        el.innerHTML = ''
        el.className = 'hidden'
    })

}

//----------------------------------------


async function send(){
    
    const email = document.getElementById('email').value;


    fetch('/api/changePassword',{
        
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ email })

    }).then( response => {
        
        
        debugger;
        
        response.json().then( _response => {
            
            if( _response.status == "ok" ){
                insertMessage(
                    "messageStatusSuccess", 
                    _response.description, 
                    3000
                )
            }

            if( _response.status == "error"){
                insertMessage(
                    "messageStatusError", 
                    _response.description, 
                    3000
                )
            }

        })

        
        
    })

}