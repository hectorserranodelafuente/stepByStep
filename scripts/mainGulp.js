const { task,series,src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify')
const rename=require('gulp-rename')
const clean = require('gulp-clean')
const gulp = require('gulp')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const fsExtra= require('fs-extra')
const htmlmin = require('gulp-htmlmin');
const viewsDeclaration = require(path.join(__dirname,'..','/modules/views/viewsDeclaration.js'))
const _env = require(path.join(__dirname,'..','env.js'))


const countFolders = async (directory) => {
    let entries
    try{
    entries = fs.readdirSync(directory);
    console.log(`directory ${directory}`)
    console.log(`entries ${entries}`)
    }catch(err){

    }
    
    return entries.length;
};



function renderCss(environment,done){
    //console.log('renderCss')
    countFolders(path.join(path.join(path.join(__dirname,'..')),'ejs')).then(count => {
        
        console.log(`count ${count}`)
        for(var i=0;i<count;i++){
              
            //if(fs.existsSync(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/partialsEJS/${partial}.ejs`))){
                
                let scriptCss = require(`../ejs/view${i+1}/argsHeadersEJS/args.js`)
                let renderedCss = 'renderedCss'
                let partial='cssHref'    
                
                if(environment=='production'){
                    renderedCss += 'Production'
                    partial += 'Production'
                }
                else if(environment=='cordova'){
                    renderedCss += 'Cordova'
                    partial += 'Cordova'
                }

                
                ejs.renderFile(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/partialsEJS/${partial}.ejs` ), scriptCss , async = true, function(err, str){
                    
                    if(!err){
                        fs.writeFileSync(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/${renderedCss}/cssHref.ejs` ), str, 'utf8'); 
                        if((count-1)==i){
                            console.log('done::renderCss')
                            done()
                        }
                    }
                    if(err){
                        console.log(err)
                    }
                    
                })
            //}
        }
    })
}

function renderHeaders(environment,done){
    console.log('renderHeaders')
    countFolders(path.join(path.join(path.join(__dirname,'..')),'ejs')).then(count => {
        
        for(var i=0;i<count;i++){

            let scriptNames = require(`../ejs/view${i+1}/argsHeadersEJS/args.js`)
            let renderedHead='renderedHead'
            let partial='head'
            if(environment=='production'){
                renderedHead += 'Production'
                partial += 'Production'
            }
            else if(environment=='cordova'){
                renderedHead += 'Cordova'
                partial += 'Cordova'
            }
            
            ejs.renderFile(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/partialsEJS/${partial}.ejs` ), scriptNames , async = true, function(err, str){
                
                if(!err){
                    fs.writeFileSync(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/${renderedHead}/head.ejs` ), str, 'utf8'); 
                    if((count-1)==i){
                        console.log('done::renderHeaders')
                        done()
                    }
                }
                if(err){
                    console.log(err)
                }
                
            })
            
        }
    });

}

task('renderHeadersDevelopment',function(done){
    renderHeaders('development',done)
})

task('renderHeadersProduction',function(done){
    renderHeaders('production',done)
})

task('renderHeadersCordova',function(done){
    renderHeaders('cordova',done)
})

task('renderCssDevelopment',function(done){
    renderCss('development',done)
})

task('renderCssCordova',function(done){
  renderCss('cordova',done)  
})



function renderMain(environment,done){
    countFolders(path.join(path.join(path.join(__dirname,'..')),'ejs')).then(count => {
        
        for(var i=0;i<count;i++){

            ejs.renderFile(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/mainEJS/main.ejs`), {environment:environment} , async = true, function(err, str){
                
                if(!err){
                    let renderedMain='renderedMain'
                    if(environment=='production'){
                        renderedMain += 'Production'
                    }
                    if(environment=='cordova'){
                        renderedMain += 'Cordova'
                    }
                    fs.writeFileSync(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/${renderedMain}/main.html`), str, 'utf8'); 
                    if((count-1)==i){
                        done()
                    }
                }else{
                    console.log(err)
                }
               
            })
            
        }
    });

}

task('renderMainDevelopment',function(done){
    renderMain('development',done)
})

task('renderMainProduction',function(done){
    renderMain('production',done)
})

task('renderMainCordova',function(done){
    renderMain('cordova',done)
})

function mainsToFolder(environment,done){

    countFolders(path.join(path.join(path.join(__dirname,'..')),'ejs')).then(count => {
        for(var i=0;i<count;i++){
            let { name } = require(`../ejs/view${i+1}/nameFileDest.js`)
            
            let dist=''
            let rendered=''
            if(environment=='production'){
                dist = "dist/"
                rendered='Production'
            }
            if(environment=='cordova'){
                dist= "cordova/views/"
                rendered = 'Cordova'
            }
            fs.mkdirSync(path.join(path.join(path.join(__dirname,'..')),`${dist}public/javascriptViews`), { recursive: true });
            fs.copyFileSync(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/renderedMain${rendered}/main.html`),path.join(path.join(path.join(__dirname,'..')),`${dist}public/javascriptViews/${name}`))
            if((count-1)==i){
                done()
            }
        
        }
    });

}

task('mainsToDevelopment',function(done){
    mainsToFolder('development',done)
})

task('cordovaToStepByStepCordova',function(){
//...
console.log('mainsToCordova')
    
    viewsDeclaration.forEach( jsonView => {
        //console.log('->',path.join(_env.development.dirPathCordovaViews,'public',jsonView.fileName))
        //console.log(path.join(_env.development.dirPathCordovaProject,jsonView.serviceName,jsonView.fileName))
        try {
            
            fsExtra.copySync(path.join(_env.development.dirPathCordovaViews,jsonView.fileName), path.join(_env.development.dirPathCordovaProject,jsonView.serviceName,jsonView.fileName))
            

          } catch (err) {
            console.error(err)
        }
    
    
    })

    fsExtra.copySync(path.join(__dirname, '..','public/js'),path.join(_env.development.dirPathCordovaProject,'js'))
    fsExtra.copySync(path.join(__dirname, '..','public/css'),path.join(_env.development.dirPathCordovaProject,'css'))
    
})

task('mainsToProduction',function(done){
    mainsToFolder('production',done)
})

task('mainsToCordova',function(done){
    mainsToFolder('cordova',done)
})

task('cleanViewsDev',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`public/javascriptViews/*.*`)).pipe(clean())
})

task('cleanViewsPro',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`dist/public/javascriptViews/*.*`)).pipe(clean())
})

task('cleanViewsCordova',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`cordova/*.*`)).pipe(clean())
})

task('cleanRenderedMain',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),'ejs/*/renderedMain/*.*')).pipe(clean())
         
})

task('cleanRenderedHeaders',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),`ejs/*/renderedHead/*.*`)).pipe(clean()) 
    
})

task('cleanRenderedCordovaHeaders',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),`ejs/*/renderedHeadCordova/*.*`)).pipe(clean()) 
    
})

task('cleanRenderedCordovaMain',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),`ejs/*/renderedMainCordova/*.*`)).pipe(clean()) 
    
})

task('cleanRenderedCss',function(){
    return src(path.join(path.join(path.join(__dirname,'..'))),`ejs/*/renderedCss/*.*`).pipe(clean())
})


task('minifyJS',function(){
    return src('public/js/*.js')
    .pipe(uglify())
    .pipe(rename({ extname:'.min.js' }))
    .pipe(dest('dist/public/js'))
})


function minifyModules() {
    return src('modules/api/*')
      .pipe(uglify({ mangle: false })).on('error', (err) => console.error('Error al minificar módulos:', err))
      .pipe(dest('dist/modules/api'));
  }
function minifyViews(){
    return src('modules/views/**/*')
    .pipe(uglify()).on('error', (err) => console.error('Error al minificar views:', err))
    .pipe(dest('dist/modules/views'));
}
function moveLogger(){
    return src('modules/logger/**/*').pipe(dest('dist/modules/logger'));
}
function uglifyLogger(){
    return src('modules/logger/**/*.js').pipe(uglify()).pipe(dest('dist/modules/logger'))
}
  
  function copyEnv() {
    return src('env.js')
      .pipe(dest('dist'));
  }
  
  function copyPackage() {
    return src('package.json')
      .pipe(dest('dist'));
  }
  
  function minifyServer() {
    
    return src('server.js')
      .pipe(uglify()).on('error', (err) => console.error('Error al minificar server.js:', err))
      .pipe(dest('dist'));
  }
  
  task('minifyBackendJS', series(
    minifyModules,
    minifyViews,
    moveLogger,
    uglifyLogger,
    copyEnv,
    copyPackage,
    minifyServer
  ));

task('minifyHTMLProduction',function(){
    return gulp.src('dist/public/javascriptViews/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/public/javascriptViews'));

})

task('minifyHTML',function(){
    
    return gulp.src('public/javascriptViews/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/public/javascriptViews'));

})

task('cleanDist',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`dist/*`)).pipe(clean()) 

})



task('cloneTheme',function(){
    //console.log(_env)
    //console.log(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/views`))
    
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/theme/ejs`),path.join(__dirname,'..','/ejs'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/theme/js`), path.join(__dirname,'..','/public/js'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/theme/css`),  path.join(__dirname,'..','/public/css'))


})


// exports.production = series('cleanDist','uglifyJS','minifyHTML')

exports.integrateTheme = series('cloneTheme')

exports.renderCordova = series(
    'cleanRenderedCordovaHeaders',
    'cleanRenderedCordovaMain',
    'renderCssCordova',
    'renderHeadersCordova',
    'renderMainCordova',
    'cleanViewsCordova',
    'mainsToCordova',
    'cordovaToStepByStepCordova'
)

exports.renderDev = series('cleanRenderedHeaders','cleanRenderedMain','renderCssDevelopment','renderHeadersDevelopment','renderMainDevelopment','cleanViewsDev','mainsToDevelopment')
exports.renderPro = series('cleanDist','cleanRenderedHeaders','cleanRenderedMain','renderHeadersProduction','renderMainProduction','mainsToProduction','minifyHTMLProduction','minifyJS','minifyBackendJS')
