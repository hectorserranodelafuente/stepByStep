let emailConf = {
    transporter:{
        host:'',
        port:587,
        secure:false,
        auth:{
            user:'',
            pass:''
        },
        tls:{
            rejectUnauthorized:false
        }
    },
    mailOptions:{
        from:''
    }
}

module.exports = emailConf