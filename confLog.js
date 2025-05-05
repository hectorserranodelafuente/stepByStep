const path = require('path')


let logsConf = {
    dirPathLogger:path.join(__dirname,'/modules/logger'),
    logsFileName:'logs.txt',
    numberLinesLog:10
}

module.exports = logsConf 