  
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