const fsExtra = require('fs-extra');
const fs = require('fs')

const countFolders = (directory) => {
    
    let entries
    try{
    entries = fs.readdirSync(directory);
    }catch(err){
    console.log(err)
    }
    
    return entries.length;
};

let lastIndex = countFolders('./ejs')
    lastIndex++
    
fsExtra.copySync('./viewInit', `./ejs/view${lastIndex}`);
