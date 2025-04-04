const Auth = require('./auth.js')

class EditUser extends Auth{
    
    /*

    (1) From inside app session
        
        { tokenSession, email, 2FA }
    
    */

    constructor(processArgv){ super(processArgv) }

    editUser(req,res){}

}