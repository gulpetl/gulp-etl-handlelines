let gulp = require('gulp')
import {handlelines} from '../src/plugin'
export { handlelines, TransformCallback } from '../src/plugin';
import * as log from 'loglevel'
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as log.LogLevelDesc)
import * as rename from 'gulp-rename'


// allCaps makes sure all string properties on the top level of lineObj have values that are all caps
const allCaps = (lineObj: object): object => {
  log.debug(lineObj)
  for (let propName in lineObj) {
    let obj = (<any>lineObj)
    if (typeof (obj[propName]) == "string")
      obj[propName] = obj[propName].toUpperCase()
  }
  
  // for testing: cause an error
  // let err; 
  // let zz = (err as any).nothing;

  return lineObj
}


function demonstrateHandlelines(callback: any) {
  return gulp.src('../testdata/*.ndjson',{buffer:false})
      // call allCaps function above for each line
      .pipe(handlelines({}, { transformCallback: allCaps }))
      .on('error', function(err:any) {
        log.error(err)
      })
      // call the built-in handleline callback, which adds an extra param
      .pipe(handlelines({ propsToAdd: { extraParam: 1 } }))
      .pipe(rename({
        suffix: "-fixed",
      }))      
      .pipe(gulp.dest('../testdata/processed'))
      .on('end', function () {
        log.info('end')
        callback()
      })
      .on('error', function (err: any) {
        log.error(err)
        callback(err)
      })
    }


exports.default = gulp.series(demonstrateHandlelines)

