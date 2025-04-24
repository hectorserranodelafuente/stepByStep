
var referenceNow
var iniziateTimer=false
var cookieBasicTwoFAuth_2, cookieBaiscTwoFAuth_1
var popUpShowed = false


function rescueCookiesFromNav(){
    
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
        if(cookie.trim().split('=')[0]=='basicTwoFAuth_2' && cookie.trim().split('=')[1]){
        cookieBasicTwoFAuth_2 = cookie.trim().split('=')[1]
        }
        if(cookie.trim().split('=')[0]=='basicTwoFAuth_1' && cookie.trim().split('=')[1]){
        cookieBasicTwoFAuth_1 = cookie.trim().split('=')[1]
        }
        if(cookie.trim().split('=')[0]=='basicTwoFAuth_0' && cookie.trim().split('=')[1]){
        
            cookieBasicTwoFAuth_0 = cookie.trim().split('=')[1]
        
            referenceNow = Number(cookieBasicTwoFAuth_0)
        
        }
        
    });
}



function iniziateInterval(){
    
    let timer = setInterval(function(){
    
        referenceNow = referenceNow + 100
    
        console.log('1.', referenceNow)
        console.log('2.', cookieBasicTwoFAuth_1)
    
    
        if( (referenceNow > cookieBasicTwoFAuth_1) && !popUpShowed ) {
            document.getElementById("popUpRenewal").className = "showed"
            popUpShowed = true
            // timer = clearInterval(timer)
        }

    }, 100)
}




rescueCookiesFromNav()
iniziateInterval()




function renewSession(){
    
    let tokenSession = cookieBasicTwoFAuth_2

    console.log('function renewSession')
    //...
    
    fetch('/api/renewSession',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenSession: tokenSession }),

    }).then(response => {
        
        rescueCookiesFromNav()

        let data  = response.json()
        

        if(data.action == 0){ 
            
            document.getElementById("messagePopUpRenewalSuccess").innerHTML = data.description
            
        }else if(data.action == 1){
            
            document.getElementById("messagePopUpRenewalError").innerHTML = data.description
            
        }
        
        
        
        setTimeout(function(){
            
            document.getElementById("popUpRenewal").className = "hidden"
            console.log('################################### closePopUp ###########################')
        
            },3000)

        popUpShowed = false


    }).catch(err=>{
        console.log(err)
    })
    
    
   

}

async function closeSession(){
    //...
    debugger;
    let token = cookieBasicTwoFAuth_2

    try{
        const _response = await fetch('http://localhost:3000/api/closeSession', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({token: token}),
                        });
        
        _data = await _response.json();

        document.cookie =  'basicTwoFAuth_2' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie =  'basicTwoFAuth_1' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        location.href="http://localhost:3000/view/basic-start/startIndex.html"

        
    
    } catch (error) {

        document.getElementById("messagePopUpRenewalError").innerHTML = _data.description
        console.error('Error capturado:', error);
    
    }

    
    
    
   
}

async function submitRenewSession(event){
    
    event.preventDefault()
    
    const optionSelected = event.target.elements['renewSession'].value;
    
    if(optionSelected=="yes"){
        
        renewSession()
        
    }else if(optionSelected=="no"){
        
        closeSession()
    
    }
}
