//redirect to basic-start
let count = 5
const timer = setInterval(function(){  
    document.getElementById("redirectMessage").innerHTML=`You will be redirected to basic-start in ${count}`
    count--
    if(count<0){ 
        count = 0 
        clearInterval(timer)
        location.href = 'http://localhost:3000/view/basic-start'
    }
},1000)
