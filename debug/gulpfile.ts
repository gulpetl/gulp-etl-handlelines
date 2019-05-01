let gulp = require('gulp')
import {handlelines} from '../src/plugin'
export { handlelines, TransformCallback } from '../src/plugin';
import * as log from 'loglevel'
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as log.LogLevelDesc)


// handleLine could be the only needed piece to be replaced for most gulp-etl plugins
const handleLine = (lineObj: object): object => {
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


function build_plumber(callback: any) {
  let result
  result =
    gulp.src('../testdata/*.ndjson',{buffer:false})//, { buffer: false }
      .pipe(handlelines({ propsToAdd: { extraParam: 1 } }, { transformCallback: handleLine }))
      .on('error', log.error)
      .pipe(gulp.dest('../testdata/processed'))
      .on('end', function () {
        log.info('end')
        callback()
      })
      .on('error', function (err: any) {
        log.error(err)
        callback(err)
      })

  return result;
}

exports.default = gulp.series(build_plumber)

