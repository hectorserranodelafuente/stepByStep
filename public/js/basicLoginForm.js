const cookies = document.cookie.split(';');
var cookieToken
cookies.forEach(cookie => {
    // If the cookies are in the list, redirect to init    
    if(cookie.trim().split('=')[0]=='basicTwoFAuth_2'&&cookie.trim().split('=')[1]){
       cookieToken = cookie.trim().split('=')[1]
       document.getElementById("closeSessionMessage").className='showed'
       document.getElementById("centeredDiv").className='centered-div centered-div-hidden'
    }
});

function forgotPassword(){
    console.log('FORGOT PASSWORD')
    location.href="./change-password-step-one"
}

//-----------------------------------------

let idList = [
    'errorCodeForm',
    'messageCode',
    'errorUserForm'
]

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

async function submitCloseSession(event){
    console.log(event)
    
    const optionSelected = document.getElementById("questionCloseSession").elements['closeSession'].value;
    let _data
    if(optionSelected==="no"){
        
        location.href = `/view/init/init.html?tokenSession=${cookieToken}`
    
    }else{
        
        let token
        
        cookies.forEach(cookie => {
            if(cookie.trim().split('=')[0] == 'basicTwoFAuth_2'&&cookie.trim().split('=')[1]){
                token = cookie.trim().split('=')[1]    
            }
        })

        try{
        const _response = await fetch('/api/closeSession', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({token: token}),
                        });
      
        _data = await _response.json();
        } catch (error) {
            console.error('Error capturado:', error);
        }

        document.getElementById('closeSessionResponse').className = 'showed'
        document.getElementById('closeSessionResponse').innerHTML = _data.description

        setTimeout(function(){

            document.getElementById('closeSessionResponse').className = 'hidden'
            document.getElementById('closeSessionMessage').className = 'hidden'
            document.getElementById("centeredDiv").className='centered-div centered-div-showed'

        },3000)

        
        document.cookie =  'basicTwoFAuth_2' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie =  'basicTwoFAuth_1' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}



var dataLogin, dataCode

async function submitForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

   dataLogin = await response.json();
    
    if( dataLogin.action == 0 ){


        // Rescue cookies and redirect
        const response2 = await fetch(`/api/getCookies`,{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({ tokenSession:dataLogin['tsession']})

        })
        
        
        dataCookie = await response2.json()
        
        if(dataCookie.status==='success'){
            
            location.href=`/view/init/init.html?tokenSession=${dataLogin.tsession}`
            
        }

    }else if( dataLogin.action == 1 ){

        document.getElementById("move-div").className = "move-div-step2"
        // document.getElementById("errorUserForm").innerHTML = ''
        // document.getElementById("errorUserForm").className = "hidden" 
        
        insertMessage("messageCode", dataLogin.description, 3000)
        
        document.getElementById("codeForm").className = "showed"
        // document.getElementById("errorCodeForm").className = "showed"
        
    }else if (dataLogin.action == 2 ){
        
        insertMessage("errorUserForm",dataLogin.description,3000)
    
    }
}




async function submitCodeForm() {
    
    const tokenTwoFASession = dataLogin.t2FASession
    const code = document.getElementById('code').value

    const response = await fetch('/api/confirm2FA',{
        method:'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ tokenTwoFASession, code })
    });

    dataCode = await response.json()
    console.log(dataCode)
    if(dataCode.action==0){
        insertMessage("errorCodeForm",dataCode.description,3000)
    }else if(dataCode.action==1){
        insertMessage("errorCodeForm",dataCode.description,3000)
    }else if(dataCode.action==2){
        insertMessage("errorCodeForm",dataCode.description,3000)
    }else if(dataCode.action==3){
        insertMessage("errorCodeForm",dataCode.description,3000)
    }else if(dataCode.action==4){

        let tokenSession = dataCode.tokenSession
        
        // Rescue cookies and redirect
        const response2 = await fetch(`/api/getCookies`,{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({tokenSession })

        })
        
        
        dataCookie = await response2.json()
        
        if(dataCookie.status==='success'){
            
            location.href=`/view/init/init.html?tokenSession=${tokenSession}`
        }
        
    
    }

    
}
