    
        
        var templateOne = `<div id="twoFATemplate">
                            <div style="width:0%;float:left;">&nbsp;</div>
                            <div style="width:100%;float:left;">
                                <fieldset style="background-color:#DDD">
                                    <div id="twoFAEmail">
                                        <input type="radio" id="radioEmail" name="twoFAOptions" value="emailTwoFA" checked>
                                        <label for="option2FA_1" style="font-weight:600;">Email</label>
                                    </div>
                                    <hr/>
                                    <div id="twoFASMS">
                                        <input type="radio" id="radioSMS" name="twoFAOptions" value="emailSMSFA">
                                        <label for="option2FA_2" style="font-weight:600;">SMS</label>
                                    </div>
                                    <div>
                                        <div>
                                            <label for="phoneNumber" class="strong" style="text-align:center">Phone Number</label>
                                            <input type="phoneNumber" id="phoneNumber" name="phoneNumber" disabled>    
                                        </div>
                                    </div> 
                                </fieldset>
                            </div>
                        </div>`

        var templateTwo = `<div id="twoFATemplate">
                            <div style="width:0%;float:left;">&nbsp;</div>
                            <div style="width:100%;float:left;">
                                <fieldset style="background-color:#DDD">
                                    <div id="twoFAEmail">
                                        <label for="option2FA_1" style="font-weight:600;">Email</label>
                                    </div>
                                </fieldset>
                            </div>
                        </div>`
        var templateThree = `<div id="twoFATemplate">
                            <div style="width:0%;float:left;">&nbsp;</div>
                            <div style="width:100%;float:left;">
                                <fieldset style="background-color:#DDD">
                                    <div id="twoFASMS">
                                        <label for="option2FA_2" style="font-weight:600;">SMS</label>
                                    </div>
                                    <div>
                                        <div>
                                            <label for="phoneNumber" class="strong" style="text-align:center">Phone Number</label>
                                            <input type="phoneNumber" id="phoneNumber" name="phoneNumber" disabled>    
                                        </div>
                                    </div> 
                                </fieldset>
                            </div>
                        </div>`
        
        var templateFour = ``

    




        if(confSignUpForm.emailOption2FA&&confSignUpForm.smsOption2FA){
            
            
            document.querySelectorAll('[template="caseOne"]')[0].innerHTML = templateOne
           
        
        }else if(confSignUpForm.emailOption2FA==true&&confSignUpForm.smsOption2FA==false){

            document.querySelectorAll('[template="caseTwo"]')[0].innerHTML = templateTwo
              
        
        }else if(confSignUpForm.emailOption2FA==false&&confSignUpForm.smsOption2FA==true){

            document.querySelectorAll('[template="caseThree"]')[0].innerHTML = templateThree
            
        
        }else if(confSignUpForm.emailOption2FA==false&&confSignUpForm.smsOption2FA==false){
            
            
            document.querySelectorAll('[template="caseFour"]')[0].innerHTML = templateFour
            document.getElementById("twoFA").disabled = true 
            document.getElementById("twoFA").checked = false
            document.getElementById("labelTwoFA").style.opacity = 0.5
            

        }



        document.getElementsByName("twoFAOptions").forEach(el=>{
            
            el.addEventListener('change', function(event){  
                
                document.getElementById("phoneNumber").disabled = !document.getElementById("phoneNumber").disabled 
                
            })

        })
        
       

        document.getElementById("twoFA").addEventListener("change", function(event){
                
            if( event.target.checked ){

                document.getElementById("twoFATemplate").style.display = "block"
            
            }else{

                document.getElementById("twoFATemplate").style.display = "none"

            }
        
        
        })
        
        function goToStartPage(){
            
            location.href = '/view/basic-start'
        
        }

   
        let dataLogin, dataCode

        async function submitForm() {

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const urlName = document.getElementById('urlName').value.trim(); 
            const twoFA = (document.getElementById('twoFA').checked) ? 1 : 0
            
            
            const response = await fetch('/api/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, urlName, twoFA }),
            });

           dataLogin = await response.json();
            
           if( dataLogin.action == 0 ){
                document.getElementById("errorUserForm").style.display = "block"
                document.getElementById("errorUserForm").innerHTML = dataLogin.description
                setTimeout(function(){
                    document.getElementById("errorUserForm").style.display = "none"
                    document.getElementById("errorUserForm").innerHTML = '' 
                },3000)
            }
            

            if( dataLogin.action == 1 ){

                document.getElementById("successUserForm").style.display = "block" 
                document.getElementById("successUserForm").innerHTML = dataLogin.description
                setTimeout(function(){
                    document.getElementById("successUserForm").style.display = "none"
                    document.getElementById("successUserForm").innerHTML = ''
                },3000)
                
            }
        }

        console.log(location.href.split('/'))