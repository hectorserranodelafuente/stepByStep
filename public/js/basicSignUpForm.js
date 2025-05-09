    
        
        var templateOne = `<div id="twoFATemplate">
                            <div style="width:0%;float:left;">&nbsp;</div>
                            <div style="width:100%;float:left;">
                                <fieldset style="background-color:#DDD">
                                    <div id="twoFAEmail">
                                        <div>
                                            <input type="radio" id="radioEmail" name="twoFAOptions" value="emailTwoFA" checked>
                                        </div>
                                        <div>
                                            <label for="option2FA_1" style="font-weight:600;">Email</label>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div id="twoFASMS" style="margin-bottom: 10px;">
                                        <div>    
                                            <input type="radio" id="radioSMS" name="twoFAOptions" value="emailSMSFA">
                                        </div>
                                        <div>
                                            <label for="option2FA_2" style="font-weight:600;">SMS</label>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div>
                                                <label for="phoneNumber" class="strong" style="text-align:center">Phone Number</label>
                                            </div>
                                            <div>
                                                <input type="phoneNumber" id="phoneNumber" name="phoneNumber">    
                                            </div>
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
                                    <div id="twoFASMS"  style="margin-bottom: 10px;">
                                        <label for="option2FA_2" style="font-weight:600;margin-top:10px;">SMS</label>
                                    </div>
                                    
                                    <div>
                                        <div>
                                            <div class="phoneNumber">
                                                <label for="phoneNumber" class="strong" style="text-align:center">Phone Number</label>
                                            </div>
                                            <div class="phoneNumber">
                                                <input type="phoneNumber" id="phoneNumber" name="phoneNumber" placeholder="34450450450">    
                                            </div>
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
            
            location.href = '/view/basic-start/startIndex.html'
        
        }

        let dataLogin, dataCode

        async function submitForm() {

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const urlName = document.getElementById('urlName').value.trim(); 
            const twoFA = (document.getElementById('twoFA').checked) ? 1 : 0
            
            let typeTwoFA 
            let phoneNumber = null
            
            if(confSignUpForm.emailOption2FA && confSignUpForm.smsOption2FA){
                
                document.getElementsByName('optionsTwoFA').forEach(el=>{
                    
                    if(el.checked){     typeTwoFA = el.value    }

                })
                     
                if(typeTwoFA=='sms'){
                    
                    phoneNumber = document.getElemenById("phoneNumber").value
                
                }

            }else if(confSignUpForm.emailOption2FA==true && confSignUpForm.smsOption2FA==false){

                typeTwoFA = 'email'
                
            
            }else if(confSignUpForm.emailOption2FA==false && confSignUpForm.smsOption2FA==true){

               typeTwoFA = 'sms'  
               
               phoneNumber = document.getElementById("phoneNumber").value 
            
            }else if(confSignUpForm.emailOption2FA==false && confSignUpForm.smsOption2FA==false){
                
                typeTwoFA = ''
                
            }
            
            
            const response = await fetch('http://127.0.0.1:3000/api/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({ 
                    email, 
                    password, 
                    urlName, 
                    twoFA, 
                    typeTwoFA, 
                    phoneNumber
                }),
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