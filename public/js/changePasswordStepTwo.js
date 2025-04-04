
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




function rescueTokenFromUrl(){  

    function obtenerParametroUrl(nombreParametro) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(nombreParametro);
    }

    let tokenSession = obtenerParametroUrl("ts"); 

    return tokenSession 

}

async function stablishNewPassword(){
    
    
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeatPassword').value;
    const token = rescueTokenFromUrl()
    const twoFA = ( document.getElementById('twoFA').value ) ? 1 : 0;
    
    if( password.trim() === repeatPassword.trim() ){
        
            try{
                
                const _response = await fetch('/api/changePasswordNext', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ 
                                        tokenChangePasswordSession: token, 
                                        password: password,
                                        twoFA: twoFA 
                                    })
                                });
              
                _data = await _response.json();
                debugger;
                if( _data.status == "success" ){
                    
                    insertMessage(
                        "messageStatusSuccess", 
                        _data.description, 
                        3000 
                    )
                
                }
    
                if( _data.status == "error"){
                    console.log
                    insertMessage(
                        "messageStatusError", 
                        _data.description, 
                        3000
                    )

                }
    

                

            }catch( error ) {
                
                console.error('Error capturado:', error);
            
            }
    }

}