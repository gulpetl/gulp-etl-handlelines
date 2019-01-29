# gulp-datatube-handlelines #

This is a **data.tube** plugin, and as such it is a [gulp](https://gulpjs.com/) plugin. **data.tube** plugins processes [ndjson](http://ndjson.org/) data streams/files which we call **Message Streams** and which are compliant with the [Singer specification](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#output). Message Streams look like this:
```
{"type": "SCHEMA", "stream": "users", "key_properties": ["id"], "schema": {"required": ["id"], "type": "object", "properties": {"id": {"type": "integer"}}}}
{"type": "RECORD", "stream": "users", "record": {"id": 1, "name": "Chris"}}
{"type": "RECORD", "stream": "users", "record": {"id": 2, "name": "Mike"}}
{"type": "SCHEMA", "stream": "locations", "key_properties": ["id"], "schema": {"required": ["id"], "type": "object", "properties": {"id": {"type": "integer"}}}}
{"type": "RECORD", "stream": "locations", "record": {"id": 1, "name": "Philadelphia"}}
{"type": "STATE", "value": {"users": 2, "locations": 1}}
```

### Usage
**data.tube** plugins accept a configObj as its first parameter. The configObj
will contain any info the plugin needs.

In addition, this plugin also accepts a TransformCallback function. That function will receive a 
Singer message object (a [RECORD](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#record-message), [SCHEMA](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#schema-message) or [STATE](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#state-message)) and is expected to return either the Singer message object (whether transformed or unchanged) to be passed downstream, or ```null``` to remove the message from the stream).

##### Sample gulpfile.js
```
let handleLines = require('gulp-datatube-handlelines')

const transformCallback = (lineObj) => {
    // return null to remove this line
    if (!lineObj.record || !lineObj.record["TestValue"]) {return null}
    
    // optionally make changes to lineObj
    lineObj.record["NewProperty"] = "asdf"

    // return the changed lineObj
    return lineObj
}

exports.default = function() {
    return src('data/*.ndjson')
    // pipe the files through our handlelines plugin
    .pipe(handleLines.handle({}, transformCallback))
    .pipe(dest('output/'));
}
```
### Model Plugin
This plugin is intended to be a model **data.tube** plugin, usable as a template to be forked to create new plugins for other uses. It is compliant with [best practices for gulp plugins](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md#what-does-a-good-plugin-look-like), and it properly handles both [buffers](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/using-buffers.md) and [streams](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/dealing-with-streams.md).

### New-School Code
If you're used to JavaScript code, here are a few newer ES6/ES7/TypeScript code features we use that might be new to you:
* [Arrow functions](https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/) are largely interchangable
 with the more familiar ```function``` syntax:

 ```let aFunction = () => {...```

 is roughly equal to

 ```function aFunction() {...```
* [Promises](https://scotch.io/tutorials/javascript-promises-for-dummies) replace callbacks to clean up and clarify our code
* [Async/await](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9) builds on promises to make asynchronous code almost as simple (in many cases) as synchronous.

### Quick Start
* Dependencies: 
    * [git](https://git-scm.com/downloads)
    * [nodejs](https://nodejs.org/en/download/releases/) - At least v6.3 (6.9 for Windows) required for TypeScript debugging
    * npm (installs with Node)
    * typescript - installed as a development dependency
    * serverless - `npm install -g serverless` to install globally
* Clone: `git clone https://github.com/donpedro/tap-ts-starter.git`
    * After cloning the repo, be sure to run `npm install` to install npm packages
* Debug: with [VScode](https://code.visualstudio.com/download) use `Open Folder` to open the project folder, then hit F5 to debug. This runs without compiling to javascript using [ts-node](https://www.npmjs.com/package/ts-node)
* Test: `npm test` or `npm t`
* Compile documentation: `npm run build-docs-tap` and `npm run build-docs-aws`
* Compile to javascript: `npm run build`
* Deploy to AWS using serverless: `serverless deploy --aws-profile [profilename]`
    * depends on [aws-cli](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) [named profiles](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)
    * additional setup is necessary; details are [here](aws-deploy.md) (adapted from [this fork](https://github.com/theSaltyConditional/tap-ts-starter), s/o to [theSaltyConditional](https://github.com/theSaltyConditional))
* More options are included from [TypeScript Library Starter](https://github.com/alexjoverm/typescript-library-starter.git) and are documented [here](starter-README.md)
* Run using included test data (be sure to build first): `node dist/tap-main.cjs.js --config tap-config.json`

### Testing

We are using [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) for our testing. We run each file in `testdata` against `parseItem`, which is the current parser, declared in tap-main.ts. This is done in `test/parse-testdata.test.ts` which is the Jest test case for testing the parser.

It works by first reading two files:

- First is the test data file, is in the `testdata` folder
- Second is a .json file that contains an expected result from running `parseItem` on the corresponding test file

These two files are passed into a "matcher" which is a jest function used to check that values meet a certain condition. We are checking if the expected result file matches what we actually get when we run `parseItem`.

#### To add a test case: 

- Add a test file to the `testdata/tests` folder
  - Run the VS Code debugger with the configuration `Debug parseItem using current opened test file` while your new test file is open on the screen.
  - Copy the output from the debug console
  - Run the copied result through this [JSON-validator](https://jsonlint.com/) in order to check is JSON is valid and to format in a more readable way
- Add a .json file to the `testdata/expectedResults` folder
- Take the newly formatted JSON and paste it into your test output file
- In "test-config.json" there is an array of JSON objects. Each object has two properties: `testdata` and `expectedresult`. Add a new object with your new file names.
- The tester will now run through all tests including the newly added test case

To run the tester: run the command `npm test` 

As the tester runs it will print which files are being tested

Example: `Tested data input: test.eml with expected output: test.json`

If a test case fails, the files it failed with will be the last files printed. 


### Notes
Note: This document is written in [Markdown](https://daringfireball.net/projects/markdown/). We like to use [Typora](https://typora.io/) and [Markdown Preview Plus](https://chrome.google.com/webstore/detail/markdown-preview-plus/febilkbfcbhebfnokafefeacimjdckgl?hl=en-US) for our Markdown work.