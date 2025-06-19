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
            let _pathMkdirDestiny = ''
            
            let rendered=''
            
            if(environment=='production'){
                
                dist = "dist/"
                _pathMkdirDestiny = `${dist}public/views`
                _pathCopyDestiny = `${dist}public/views/${name}`
                rendered='Production'
            }
            if(environment=='cordova'){
                
                dist= "cordova/views"
                _pathMkdirDestiny = `${dist}`
                _pathCopyDestiny = `${dist}/${name}` 
                rendered = 'Cordova'
            }
            
            //console.log( `_pathMkdirDestiny ${_pathMkdirDestiny}`)
            //console.log( `_pathCoyDestiny ${_pathCopyDestiny}` )
            
            if(i==0){

                fs.mkdirSync(path.join(path.join(path.join(__dirname,'..')), _pathMkdirDestiny ), { recursive: true });
            
            }

            //console.log( path.join(path.join(path.join(__dirname,'..')),_pathCopyDestiny ))

            fs.copyFileSync(path.join(path.join(path.join(__dirname,'..')),`ejs/view${i+1}/renderedMain${rendered}/main.html`),path.join(path.join(path.join(__dirname,'..')),_pathCopyDestiny ))
            
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
            
            //console.log('1',path.join(_env.development.dirPathCordovaViews,jsonView.fileName))
            //console.log('2',path.join(_env.development.dirPathCordovaProject,jsonView.serviceName,jsonView.fileName))
            
            fsExtra.copySync(path.join(_env.development.dirPathCordovaViews,jsonView.fileName), path.join(_env.development.dirPathCordovaProject,jsonView.serviceName,jsonView.fileName))
            

          } catch (err) {
            console.error(err)
        }
    
    
    })

    //fsExtra.copySync(path.join(__dirname, '..','public/js'),path.join(_env.development.dirPathCordovaProject,'js'))
    //fsExtra.copySync(path.join(__dirname, '..','public/css'),path.join(_env.development.dirPathCordovaProject,'css'))
    
})

task('mainsToProduction',function(done){
    mainsToFolder('production',done)
})

task('mainsToCordova',function(done){
    mainsToFolder('cordova',done)
})

task('cleanViewsDev',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`public/views/*.*`)).pipe(clean())
})

task('cleanViewsPro',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`dist/public/views/*.*`)).pipe(clean())
})

task('cleanViewsCordova',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`cordova/views/*`)).pipe(clean())
})

task('cleanRenderedMain',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),'ejs/*/renderedMain/*.*')).pipe(clean())
         
})



function isView(_path){
    
    
    const referenceViewInitPath = path.join(_env.development.dirPathProject,'viewInit')
    
    let firstPartToCompare = fs.readdirSync( _path, 'utf8' )
    let secondPartToCompare = fs.readdirSync(referenceViewInitPath,`utf8`)

    return firstPartToCompare.every( item =>{ 

        return secondPartToCompare.includes(item)

    }) && (firstPartToCompare.length===secondPartToCompare.length)


}


function checkedAllFolderStructure(nextParents){

    return nextParents.every( item => item.isView )

}

/*
################################# 
        INCREMENTAL VIEWS
#################################
 */

var levels = []

function isView(_path){
    
    
    const referenceViewInitPath = path.join(_env.development.dirPathProject,'viewInit')
    
    let firstPartToCompare = fs.readdirSync( _path, 'utf8' )
    let secondPartToCompare = fs.readdirSync(referenceViewInitPath,`utf8`)

    return firstPartToCompare.every( item =>{ 

        return secondPartToCompare.includes(item)

    }) && (firstPartToCompare.length===secondPartToCompare.length)


}


function checkedAllFolderStructure(nextParents){

    return nextParents.every( item => item.isView )

}


// DEF: It returns a json containing completePath

function runThroughBranchFromEndBranch( levelRegister, name ){
    
    
    let _levelRegister, _name
    let nextRegister
    let segmentsPath = []

    let originalLevelRegister, originalName


    _levelRegister = levelRegister
    _name = name
    originalLevelRegister = levelRegister
    originalName = name

    do{
        
        nextRegister = levels.find( level => {

            return ((level.level == _levelRegister) && (level.name===_name))
        
        })
        
        segmentsPath.unshift(nextRegister.name)
            
        _levelRegister = _levelRegister-1
        
        _name = nextRegister.parent
        
    
    }while( _levelRegister > -1 )

        let completePath = path.join(__dirname,'..') 
        
        segmentsPath.forEach( segment => {
            
            completePath = path.join( completePath, segment )

        })
    
   
    return { segmentsPath: segmentsPath, completePath: completePath }
}

task('incrementalViewsExtractInfo', function(done){
    
    // Only posible structure of folders
    
    /*
        folder
            folder
            folder
                view
    
    */
    
    
    // 1. getLevels
    
    let _limitRegister

    levels = [
            
           {    
                
                level: 0,
                actualParent:null,
                name:'incrementalEjs',
                isView:false,
                completePath:path.join(__dirname,'..','incrementalEjs'),
                finishedBranch:false
            
            }
    ]
    
    // 2. completePaths
    
    let actualLevel = 0
    
    let listParents = []

    let nextParents = [
        { 
            relativePath:`incrementalEjs`,       
            name:'incrementalEjs', 
            isView:false, 
            completeParentPath: path.join(__dirname,'..','incrementalEjs') 
        }
    ]

    let actualIndexListParents = 0

    let limitAchieved = false

    do{
    
        actualLevel++
        listParents = [...nextParents]
        
        do {
        
            let actualParent = listParents[ actualIndexListParents ].relativePath
            
            if( ! listParents[ actualIndexListParents ].isView ){
                
                
                let itemFolderstructure = fs.readdirSync( actualParent, 'utf8' )  
                /*
                console.log(`#############`)

                console.log(`actualParent ${actualParent}`)

                console.log(actualParent.split('/').filter( el => el !== "incrementalEjs" ).join('/'))

                console.log(`#############`)
                */
                
                for(var item of itemFolderstructure ){  
                    
                    let completePath = path.join(listParents[actualIndexListParents].completeParentPath,item)

                    let itemRegister = {    
                        
                        level: actualLevel,

                        parent: listParents[ actualIndexListParents ].name,
                        
                        actualParent:actualParent,
                        
                        destinyViewsActualParent:actualParent.split('/').filter( el => el !== levels.find(level=>level.level==0).name ).join('/'),
                        
                        name:item,
                        
                        isView:isView( completePath ),
                        
                        completePath:completePath,
                        
                        finishedBranch:isView( completePath )
                    
                    }
                    
                    levels.push( itemRegister )


                    let _completePath = runThroughBranchFromEndBranch( actualLevel , item  ).completePath

                    
                    nextParents.push( { 
                        relativePath: `${actualParent}/${item}`, 
                        name: item, isView:itemRegister.isView, 
                        completeParentPath:_completePath 
                    } )
                
                }
            
            }else{

                if( levels.filter(item => (actualLevel == item.level)).every( item => item.isView )){
                    
                    limitAchieved = true
                
                }
            
            }

            actualIndexListParents++
            
        
        }while( actualIndexListParents <= ( listParents.length-1 ) )
    
    
    
    }while(!limitAchieved)

        console.log(JSON.stringify(levels))
    done()
    

    // return levels

})


task(`incrementalCleanRenderedHeaders`, function(done){
    
    levels.filter(level=>level.isView).forEach( level => {
        
        let _path = path.join(`${level.completePath}`,`renderedHead/*.*`)
       
        src(_path).pipe(clean())
    
    })

    done()


})


task('incrementalCleanRenderedCordovaHeaders',function(done){
    

    levels.filter(level=>level.isView).forEach( level => {
        
        let _path = path.join(`${level.completePath}`,`renderedHeadCordova/*.*`)
       
        src(_path).pipe(clean())

    
    
    })

    done()

})




task(`incrementalCleanRenderedMain`,function(done){
    
     levels.filter(level=>level.isView).forEach( level => {

        let _path = path.join(`${level.completePath}`,`renderedMain/*.*`)
        
        src(_path).pipe(clean())
    
    })

    done()

})


task(`incrementalCleanRenderedCordovaMain`,function(done){
    
     levels.filter(level=>level.isView).forEach( level => {

        let _path = path.join(`${level.completePath}`,`renderedMainCordova/*.*`)
        
        src(_path).pipe(clean())
    
    })

    done()

})


function incrementalRenderCss(environment, done){
    
    console.log('incrementalRenderCss')
    
    levels.filter(level=>level.isView).forEach( (level, index) => {

        let _path = path.join(`${ level.completePath }`,`argsHeadersEJS/args.js`)
        let scriptCss = require(_path)
        var renderedCss = 'renderedCss'
        
        let partial = 'cssHref' 
        
        if(environment=='production'){
            renderedCss += 'Production'
            partial += 'Production'
        }
        else if(environment=='cordova'){
            renderedCss += 'Cordova'
            partial += 'Cordova'
        }

        let _pathRender = path.join(`${ level.completePath }`,`partialsEJS/${partial}.ejs`)

        
        ejs.renderFile(_pathRender , scriptCss , async = true, function(err, str){    

             if(!err){
                
                let _pathWrite = path.join( `${level.completePath}`, `${renderedCss}/cssHref.ejs`)
                
                fs.writeFileSync(_pathWrite, str, 'utf8'); 
                
                console.log( levels.length - 1 )
                
                console.log( index ) 
                
                if( levels.filter(level=>level.isView).length-1 == index ){
                    
                    done()
                    
                    console.log(`incrementalRenderCss - Done`)
                }

            }
            if(err){
                console.log(err)
            }
        
        
        }) 

    })

}



task(`incrementalRenderCssDevelopment`, function(done){ 
    
    incrementalRenderCss(`development`, done)

})


task(`incrementalRenderCssCordova`, function(done){ 
    
    incrementalRenderCss(`cordova`, done)

})



function incrementalRenderHeaders(environment,done){
    
    console.log(`--incrementalRenderHeaders`)

    levels.filter( level => level.isView ).forEach( (level, index) => {
        
        let _path = path.join(`${ level.completePath }`,`argsHeadersEJS/args.js`)
        
        console.log(`_path ${_path}`)
        
        let scriptNames = require(_path)

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
    
        
            let _pathRender = path.join(`${ level.completePath }`,`partialsEJS/${partial}.ejs`)
    
            ejs.renderFile( _pathRender, scriptNames , async = true, function(err, str){
                
                if(!err){
                    
                    let _pathWrite = path.join(`${level.completePath}`,`${renderedHead}/head.ejs`)
                    
                    console.log(`_pathWrite ${_pathWrite}`)
                    
                    fs.writeFileSync( _pathWrite, str, 'utf8'); 
                    
                    if(levels.filter(level=>level.isView).length-1){
                        //console.log('done::renderHeaders')
                        done()
                    }
                }
                if(err){
                    console.log(err)
                }
                
            })
    
    
    })
    
    
    /*  ################################################################ */
   

}



task(`incrementalRenderHeadersDevelopment`, function(done){ 
    
    incrementalRenderHeaders(`development`, done)

})

task(`incrementalRenderHeadersCordova`, function(done){ 
    
    incrementalRenderHeaders(`cordova`, done)

})


function incrementalRenderMain( environment, done ){

    console.log(`incrementalRenderMain`)

    levels.filter( level => level.isView ).forEach( (level, index) => {   
    
        let _path = path.join(`${ level.completePath }`,`mainEJS/main.ejs`) 
        
        console.log(`_path ${_path}`)
    
        ejs.renderFile(_path, {environment:environment} , async = true, function(err, str){
                
                if(!err){
                    
                    let renderedMain='renderedMain'
                    if(environment=='production'){
                        renderedMain += 'Production'
                    }
                    if(environment=='cordova'){
                        renderedMain += 'Cordova'
                    }
                    let writePath = path.join(`${ level.completePath }`,`${renderedMain}/main.html`)
                    
                    console.log(` WritePath ${ writePath }`)
                    
                    fs.writeFileSync(writePath, str, 'utf8'); 
                    
                    if( index == levels.filter( level => level.isView ).length-1 ){
                        done()
                    }
                }else{
                    console.log(err)
                }
               
            })
        
    
    })

}


task(`incrementalRenderMainDevelopment`, function(done){ 
    
    incrementalRenderMain(`development`, done)

})

task(`incrementalRenderMainCordova`, function(done){ 
    
    incrementalRenderMain(`cordova`, done)

})


task('incrementalCleanViewsDev',function(){
    let _path = path.join(path.join(path.join(__dirname,'..')),`public/incrementalViews/*.*`)
    return src(_path).pipe(clean())
})


function incrementalMainsToFolder(environment,done){

    console.log( `levels => ${JSON.stringify(levels)}`)

    levels.filter( level => level.isView ).forEach( (level, index) => { 
            
            let _path = path.join(`${ level.completePath }`,`nameFileDest.js`)
            let { name } = require(_path)
            
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
            
            let _writePath = path.join(path.join(path.join(__dirname,'..')),`${dist}public/incrementalViews`)
            
            fs.mkdirSync(_writePath, { recursive: true });
            
            let _originPath = path.join(`${ level.completePath }`,`renderedMain${rendered}/main.html`)
            
            // console.log(JSON.stringify(level))

            // console.log(`_originPath ${_originPath}`)

            let _destinyPath = path.join(path.join(path.join(path.join(path.join(__dirname,'..')),`${dist}public/incrementalViews`),`${level.destinyViewsActualParent}/${level.name}`),`${name}`)

            // console.log(`_destinyPath ${_destinyPath}`)
            
            fsExtra.copySync(_originPath,_destinyPath)
            
            if(index==levels.filter(level=>level.isView).length-1){
                done()
            }
    
    })

}

task('incrementalMainsToDevelopment',function(done){
    incrementalMainsToFolder('development',done)
})



task('cleanIncrementalViewsCordova',function(){
    
    return src(path.join(path.join(path.join(__dirname,'..')),`cordova/*.*`)).pipe(clean())
    
    done()
    
})


function incrementalMainsToCordova(environment,done){
    
    levels.filter( level => level.isView ).forEach( (level, index) => { 
        
            let _path = path.join(`${ level.completePath }`,`nameFileDest.js`)

            let { name } = require(_path)
            
            let dist=''
            let rendered=''
            
            if(environment=='production'){
                dist = "dist/"
                rendered='Production'
            }
            
            if(environment=='cordova'){
                dist= "cordova/"
                rendered = 'Cordova'
            }
            
            fs.mkdirSync(path.join(path.join(path.join(__dirname,'..')),`${dist}public/incrementalViews`), { recursive: true });
            
            
            
            let _originPath = path.join(`${ level.completePath }`,`renderedMain${rendered}/main.html`)

           

            let _destinyPath = path.join(path.join(path.join(path.join(path.join(__dirname,'..')),`${dist}/incrementalViews`),`${level.destinyViewsActualParent}/${level.name}`),`${name}`)

            
            
            fsExtra.copySync(_originPath,_destinyPath)
            
            
            if((levels.filter(level=>level.isView).length-1)==index){
                
                done()
            
            }
    
    
    })
    

}

task('incrementalMainsToCordova',function(done){

    incrementalMainsToCordova('cordova',done)

})

task('incrementalCordovaToStepByStepCordova',function(){
    //...
    console.log(`incremental;ainsToCordova ${JSON.stringify(viewsDeclaration)}`)
    
    viewsDeclaration.filter(view=> (view.html == '/public/incrementalViews/')).forEach( jsonView => {
        console.log('-')
        try {

            console.log(_env.development.dirPathCordovaViews)
            console.log(_env.development.dirPathCordovaProject)
            
            let _pathOrigin = path.join(path.join(path.join(__dirname,'..'),'cordova'),path.join(`${jsonView.serviceName}`,`${jsonView.fileName}`))
            let _pathDestiny =path.join(_env.development.dirPathCordovaProject,`${jsonView.serviceName}/${jsonView.fileName}`)
           
            
            // let _pathDestiny = path.join(path.join(path.join(path.join(path.join(__dirname,'..')),`${dist}public/incrementalViews`),`${level.destinyViewsActualParent}/${level.name}`),`${name}`)

            console.log(`_pathOrigin ${_pathOrigin}`)
            console.log(`_pathDestiny ${_pathDestiny}`)
            
            fsExtra.copySync(_pathOrigin,_pathDestiny)
            

          } catch (err) {
            console.error(err)
          }
    
    
    })

    //fsExtra.copySync(path.join(__dirname, '..','public/js'),path.join(_env.development.dirPathCordovaProject,'js'))
    //fsExtra.copySync(path.join(__dirname, '..','public/css'),path.join(_env.development.dirPathCordovaProject,'css'))
    
})



/*
################################
        END INCREMENTAL
################################
*/



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
    return gulp.src('dist/public/views/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/public/views'));

})

task('minifyHTML',function(){
    
    return gulp.src('public/views/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/public/views'));

})

task('cleanDist',function(){
    return src(path.join(path.join(path.join(__dirname,'..')),`dist/*`)).pipe(clean()) 

})



task('cloneTheme',function(){
    
    // console.log(_env)
    // console.log(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/views`))
    
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/theme/ejs`),path.join(__dirname,'..','/ejs'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/theme/js`), path.join(__dirname,'..','/public/js'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/theme/css`),  path.join(__dirname,'..','/public/css'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.frontTheme}/theme/img`),  path.join(__dirname,'..','/public/img'))


})

task('cloneApi',function(){
    
    // console.log(path.join(__dirname,'..',`/node_modules/${_env.development.backAPI}`))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.backAPI}/api`), path.join(__dirname,'..','/modules/api'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.backAPI}/test`), path.join(__dirname,'..','/test'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.backAPI}/scriptsDb/createDbDev.js`),  path.join(__dirname,'..','/scripts/createDbDev.js'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.backAPI}/scriptsDb/createDbPro.js`), path.join(__dirname,'..','/scripts/createDbPro.js'))
    fsExtra.copySync(path.join(__dirname,'..',`/node_modules/${_env.development.backAPI}/scriptsDb/createDbTest.js`),  path.join(__dirname,'..','/script/createDbTest.js'))
})

task('transportCordovaCssJs',function(done){
    
    fsExtra.copySync(path.join(__dirname, '..','public/js'),path.join(_env.development.dirPathCordovaProject,'js'))
    fsExtra.copySync(path.join(__dirname, '..','public/css'),path.join(_env.development.dirPathCordovaProject,'css'))
    done()

})

// exports.production = series('cleanDist','uglifyJS','minifyHTML')

exports.integrateTheme = series('cloneTheme')

exports.integrateAPI = series('cloneApi')

exports.renderCordova = series(
    'cleanRenderedCordovaHeaders',
    'cleanRenderedCordovaMain',
    'renderCssCordova',
    'renderHeadersCordova',
    'renderMainCordova',
    'cleanViewsCordova',
    'mainsToCordova',
)

exports.transportCordovaViews = series('cordovaToStepByStepCordova')

exports.transportCordovaCssJs = series('transportCordovaCssJs')



exports.renderDev = series('cleanRenderedHeaders','cleanRenderedMain','renderCssDevelopment','renderHeadersDevelopment','renderMainDevelopment','cleanViewsDev','mainsToDevelopment')
exports.renderPro = series('cleanDist','cleanRenderedHeaders','cleanRenderedMain','renderHeadersProduction','renderMainProduction','mainsToProduction','minifyHTMLProduction','minifyJS','minifyBackendJS')

exports.incrementalRenderDev = series(
    `incrementalViewsExtractInfo`,
    `incrementalCleanRenderedHeaders`,
    `incrementalCleanRenderedMain`,
    `incrementalRenderCssDevelopment`,
    `incrementalRenderHeadersDevelopment`,
    `incrementalRenderMainDevelopment`,
    `incrementalCleanViewsDev`,
    `incrementalMainsToDevelopment`
)



exports.incrementalRenderCordova = series(
    `incrementalViewsExtractInfo`,
    'incrementalCleanRenderedCordovaHeaders',
    'incrementalCleanRenderedCordovaMain',
    'incrementalRenderCssCordova',
    'incrementalRenderHeadersCordova',
    'incrementalRenderMainCordova',
    'cleanIncrementalViewsCordova',
    'incrementalMainsToCordova',
)

exports.transportIncrementalCordovaViews = series('incrementalCordovaToStepByStepCordova') 
