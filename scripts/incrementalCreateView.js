const fsExtra = require('fs-extra')
const fs = require('fs')
const env = require('../env.js')

fsExtra.copySync(`${env.development.dirPathProject}/viewInit`, process.cwd());