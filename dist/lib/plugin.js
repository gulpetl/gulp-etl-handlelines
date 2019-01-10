"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const through2 = require('through2');
const split = require('split');
const PluginError = require("plugin-error");
// consts
const PLUGIN_NAME = 'gulp-datatube-handlelines';
/* This is a model data.tube plugin. It is compliant with best practices for Gulp plugins (see
https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md#what-does-a-good-plugin-look-like ),
but with an additional feature: it accepts a configObj as its first parameter */
function handler(configObj, newHandleLine) {
    let propsToAdd = configObj.propsToAdd;
    // handleLine could be the only needed piece to be replaced for most dataTube plugins
    const defaultHandleLine = (lineObj) => {
        for (let propName in propsToAdd) {
            lineObj[propName] = propsToAdd[propName];
        }
        return lineObj;
    };
    const handleLine = newHandleLine ? newHandleLine : defaultHandleLine;
    let transformer = through2.obj(); // new transform stream, in object mode
    // since we're in object mode, dataLine comes as a string. Since we're counting on split
    // to have already been called upstream, dataLine will be a single line at a time
    transformer._transform = function (dataLine, encoding, callback) {
        let returnErr = null;
        try {
            let dataObj;
            if (dataLine.trim() != "")
                dataObj = JSON.parse(dataLine);
            let handledObj = handleLine(dataObj);
            if (handledObj) {
                let handledLine = JSON.stringify(handledObj);
                console.log(handledLine);
                this.push(handledLine + '\n');
            }
        }
        catch (err) {
            returnErr = new PluginError(PLUGIN_NAME, err);
        }
        callback(returnErr);
    };
    // creating a stream through which each file will pass
    // see https://stackoverflow.com/a/52432089/5578474 for a note on the "this" param
    const strm = through2.obj(function (file, encoding, cb) {
        const self = this;
        let returnErr = null;
        if (file.isNull()) {
            // return empty file
            return cb(returnErr, file);
        }
        else if (file.isBuffer()) {
            // strArray will hold file.contents, split into lines
            const strArray = file.contents.toString().split(/\r?\n/);
            let tempLine;
            // we'll call handleLine on each line
            for (let dataIdx in strArray) {
                try {
                    tempLine = handleLine((strArray[dataIdx]));
                    if (tempLine)
                        strArray[dataIdx] = JSON.stringify(tempLine);
                    else
                        strArray.splice(Number(dataIdx), 1); // remove the array item if handleLine returned null
                }
                catch (err) {
                    returnErr = new PluginError(PLUGIN_NAME, err);
                }
            }
            let data = strArray.join('\n');
            console.log(data);
            file.contents = new Buffer(data);
            // send the transformed file through to the next gulp plugin, and tell the stream engine that we're done with this file
            cb(returnErr, file);
        }
        else if (file.isStream()) {
            file.contents = file.contents
                // split plugin will split the file into lines
                .pipe(split())
                // our transformer stream, created above, will deal with each line using handleLine
                .pipe(transformer)
                .on('finish', function () {
                // using finish event here instead of end since this is a Transform stream   https://nodejs.org/api/stream.html#stream_events_finish_and_end
                console.log('finished');
                // send the transformed file goes through to the next gulp plugin
                self.push(file);
                // tell the stream engine that we are done with this file
                cb(returnErr);
            })
                .on('error', function (err) {
                //console.error(err)
                cb(new PluginError(PLUGIN_NAME, err));
            });
        }
    });
    return strm;
}
exports.handler = handler;
//# sourceMappingURL=plugin.js.map