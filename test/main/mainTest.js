
const Accumulator = require('../accumulator.js')
const gulpTask = require('../../scripts/mainGulp.js')

const Case1 = require('../cases/signUp/case1.test.js')
const Case2 = require('../cases/signUp/case2.test.js')
const Case3 = require('../cases/signUp/case3.test.js')
const Case4 = require('../cases/signUp/case4.test.js')
const Case5 = require('../cases/login/case5.js')

const { test } = require('../../env.js')

function dist(){    
    console.log('DIST')
}

let inst1,inst2,inst3

    inst1 = new Case1(false, null)
   

let instances = [ inst1]
let time=3000

instances.forEach((inst,index) => {

    setTimeout(function(){
        inst.main(process.argv)
    },time)
    
    time+=3000
})
   
