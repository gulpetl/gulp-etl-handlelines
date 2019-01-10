let gulp = require('gulp')
import * as linehandler from './plugin'
export {handler, TransformCallback} from './plugin';
const split = require('split')

import _ from 'highland'
//import * as plumber from 'gulp-plumber'
const plumber = require('gulp-plumber')
 function build(callback:any) {
    let result
       result = 
        _(gulp.src('./testdata/*', { buffer: false }))
        //.src('./testdata/*') // buffer is true by default
        .through(linehandler.handler({propsToAdd:{extraParam:1}}))
        .errors((err, push) => {
          // if (err.statusCode === 404) {
          //   // not found, return empty doc
          //   push(null, {});
          // }
          if (err) {
            // swallow error?
            console.log('gotcha!')
          }
          else {
              // otherwise, re-throw the error
              push(err);
          }          
        })         
        // .on('error', function(this:any,err: any) {
        //   console.error(err)
        //   err.showStack = true
        //   callback(err)
          
        //   // reconnect the pipe
        //   //this.pipe(plugins.addProperties({propsToAdd:{extraParam:1}}))
        // })
        .pipe(gulp.dest('./output/processed'))
        .on('end', function() {
          console.log('end')
          callback()
        })
        .on('error', function(err: any) {
          console.error(err)
          callback(err)
        })

    return result;
  }

  // handleLine could be the only needed piece to be replaced for most dataTube plugins
  const handleLine = (lineObj : Object): Object => {
    //console.log(line)
    for (let propName in lineObj) {
      let obj = (<any>lineObj)
      if (typeof(obj[propName]) == "string")
        obj[propName] = obj[propName].toUpperCase()
    }
    return lineObj
  }

  function build_plumber(callback:any) {
    let result
       result = 
        gulp.src('./testdata/*', { buffer: false })
        //.src('./testdata/*') // buffer is true by default
//        .pipe(plumber({errorHandler:false}))
        .pipe(linehandler.handler({propsToAdd:{extraParam:1}}, handleLine))
        .on('error', console.error.bind(console))
        // .on('error', function(this:any,err: any) {
        //   console.error(err)
        //   err.showStack = true
        //   callback(err)
          
        //   // reconnect the pipe
        //   //this.pipe(plugins.addProperties({propsToAdd:{extraParam:1}}))
        // })
        .pipe(gulp.dest('./output/processed'))
        .on('end', function() {
          console.log('end')
          callback()
        })
        .on('error', function(err: any) {
          console.error(err)
          callback(err)
        })

    return result;
  }

  exports.default = gulp.series(build_plumber)