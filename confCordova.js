const path = require('path')


let cordovaConf = {
    pathCordovaProject: path.join(__dirname,'..','stepByStepCordova/www'),
    pathCordovaViews: path.join(__dirname,'cordova/views/public/javascriptViews')
}

module.exports = cordovaConf