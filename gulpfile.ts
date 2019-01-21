let gulp = require('gulp')
import * as linehandler from './plugin'
export { handler, TransformCallback } from './plugin';
const split = require('split')
import Vinyl = require('vinyl')
import { ThroughStream } from 'through';
const through2 = require('through2')

// handleLine could be the only needed piece to be replaced for most dataTube plugins
const handleLine = (lineObj: object, self: any): object => {
  //console.log(line)
  for (let propName in lineObj) {
    let obj = (<any>lineObj)
    if (typeof (obj[propName]) == "string")
      obj[propName] = obj[propName].toUpperCase()
  }
  return lineObj
}

let count: number = 0;
let filecount: number = 0;
let newFile = new Vinyl({
  path: 'linesA' + filecount + '.txt',
  contents: through2.obj()
})
const splitStream = (lineObj: object, self: any): object | null => {

  count++;
  (newFile.contents as unknown as ThroughStream).push(JSON.stringify(lineObj) + '\n')
  if (count == 2) {
    (newFile.contents as unknown as ThroughStream).end();
    self.push(newFile)
    newFile = new Vinyl({
      path: 'linesA' + (++filecount) + '.txt',
      contents: through2.obj()
    })
    count = 0;
  }
  return null;

}
const finishHandler = (file: Vinyl, self: any): object | null => {
  console.log("The handler has officially ended!");
  console.log("count: " + count);

  (file.contents as unknown as ThroughStream).end();
  (newFile.contents as unknown as ThroughStream).end();
  if (count != 0) {
    self.push(newFile)
  }

  // self.push(file);
  return null;
}
function build_plumber(callback: any) {
  let result
  result =
    gulp.src('./testdata/*', { buffer: false })//
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

exports.default = gulp.series(build_plumber)