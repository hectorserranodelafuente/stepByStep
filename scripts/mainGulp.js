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
    }catch(err){

    }
    
    return entries.length;
};



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



function renderMain(environment,done){
    countFolders(path.join(path.join(path.join(__dirname,'..')),'ejs')).then(count => {
        
        for(var i=0;i<count;i++){

            ejs.renderFile(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/mainEJS/main.ejs`), {environment:environment} , async = true, function(err, str){
                
                if(!err){
                    let renderedMain='renderedMain'
                    if(environment=='production'){
                        renderedMain += 'production'
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

task('mainsToCordova',function(){
//...
    //console.log('-',env.development.dirPathCordovaProject)
   
   viewsDeclaration.forEach( jsonView => {
        //console.log(env.dirPathCordovaProject)
        try {
            //console.log(_env.development.dirPathCordovaProject)
            //console.log(`${path.join(__dirname,'..',jsonView.html,jsonView.fileName)}`)
            //console.log(`${path.join(_env.development.dirPathCordovaProject,jsonView.serviceName,jsonView.html)}`)
            fsExtra.copySync(`${path.join(__dirname,'..',jsonView.html,jsonView.fileName)}`, `${path.join(_env.development.dirPathCordovaProject,jsonView.serviceName,jsonView.fileName)}`)
            //console.log('success!')
          } catch (err) {
            //console.error(err)
        }
    
    
    })
    


})

task('mainsToProduction',function(done){
    mainsToFolder('production',done)
})

task('cleanViewsDev',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`public/javascriptViews/*.*`)).pipe(clean())
})

task('cleanViewsPro',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`dist/public/javascriptViews/*.*`)).pipe(clean())
})

task('cleanRenderedMain',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),'ejs/*/renderedMain/*.*')).pipe(clean())
         
})

task('cleanRenderedHeaders',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),`ejs/*/renderedHead/*.*`)).pipe(clean()) 
    
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


//exports.production = series('cleanDist','uglifyJS','minifyHTML')
exports.renderDev = series('cleanRenderedHeaders','cleanRenderedMain','renderHeadersDevelopment','renderMainDevelopment','cleanViewsDev','mainsToDevelopment','mainsToCordova')
exports.renderPro = series('cleanDist','cleanRenderedHeaders','cleanRenderedMain','renderHeadersProduction','renderMainProduction','mainsToProduction','minifyHTMLProduction','minifyJS','minifyBackendJS')
