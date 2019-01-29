let gulp = require('gulp')
import {handlelines} from './plugin'
export { handlelines, TransformCallback } from './plugin';

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
    gulp.src('../InputOutput/testdata/*',{buffer:false})//, { buffer: false }
      .pipe(handlelines({ propsToAdd: { extraParam: 1 } }, { transformCallback: handleLine }))
      .on('error', console.error.bind(console))
      .pipe(gulp.dest('../InputOutput/output/processed'))
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

exports.default = gulp.series(build_plumber)

