let gulp = require('gulp')
import * as linehandler from './plugin'
export { handler, TransformCallback } from './plugin';
const split = require('split')
import Vinyl = require('vinyl')
import { ThroughStream } from 'through';
const through2 = require('through2')

// handleLine could be the only needed piece to be replaced for most dataTube plugins
const handleLine = (lineObj: object): object => {
  //console.log(line)
  for (let propName in lineObj) {
    let obj = (<any>lineObj)
    if (typeof (obj[propName]) == "string")
      obj[propName] = obj[propName].toUpperCase()
  }
  return lineObj
}


function build_plumber(callback: any) {
  let result
  result =
    gulp.src('./testdata/*',{buffer:false})//, { buffer: false }
      //.src('./testdata/*') // buffer is true by default
      //        .pipe(plumber({errorHandler:false}))
      .pipe(linehandler.handler({ propsToAdd: { extraParam: 1 } }, { transformCallback: handleLine }))
      .on('error', console.error.bind(console))
      // .on('error', function(this:any,err: any) {
      //   console.error(err)
      //   err.showStack = true
      //   callback(err)

      //   // reconnect the pipe
      //   //this.pipe(plugins.addProperties({propsToAdd:{extraParam:1}}))
      // })
      .pipe(gulp.dest('./output/processed'))
      .on('end', function () {
        console.log('end')
        callback()
      })
      .on('error', function (err: any) {
        console.error(err)
        callback(err)
      })

  return result;
}

function getDateStamp() {
  const dt: Date = new Date()
  const dateStamp =
    Number(String(dt.getFullYear()).substr(2, 2))
      .toString(32)
      .padStart(2, '0') + // 2-digit year converted to base32
    (dt.getMonth() + 1).toString(32) + // month (1-12) converted to base32
    dt.getDate().toString(32) + // day (1-31) converted to base 32
    '_' +
    // hmmss, where h is in base32, but mmss is in normal base10 (base 10 for readability; we can't save any digits by using base32)
    dt.getHours().toString(32) +
    String(dt.getMinutes()).padStart(2, '0') +
    String(dt.getSeconds()).padStart(2, '0') +
    '_' +
    // milliseconds, in base32
    dt
      .getMilliseconds()
      .toString(32)
      .padStart(2, '0')
  return dateStamp;
}

exports.default = gulp.series(build_plumber)

