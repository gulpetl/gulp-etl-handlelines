let gulp = require('gulp')
import * as linehandler from './plugin'
export {handler, TransformCallback} from './plugin';
const split = require('split')
import Vinyl from 'vinyl'
const through2 = require('through2')

  // handleLine could be the only needed piece to be replaced for most dataTube plugins
  const handleLine = (lineObj : object): object => {
    //console.log(line)
    for (let propName in lineObj) {
      let obj = (<any>lineObj)
      if (typeof(obj[propName]) == "string")
        obj[propName] = obj[propName].toUpperCase()
    }
    return lineObj
  }

  const splitStream = (lineObj: object): object | null => {

    
    return null;
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