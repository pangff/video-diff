'use strict';

const fs = require('fs');
const JPEG = require('jpeg-js');
const PNG = require('pngjs').PNG;
const shell = require('shelljs');
const pixelmatch = require('pixelmatch');
const command = require('./lib/command')


let pathOrigin = 'dist/origin';
let filesOrigin;

let pathTest = 'dist/test';
let filesTest;

const THRESHOLD_PIXELS_COUNT = 0;//最大可容忍不同像素点数
const PIXEL_MATCH_THRESHOLD = 0.1;//PIXEL_MATCH点的比对严格程度（0-1），值越小比对越严格发现的不同像素点越多。


const readImage=(path)=> {
  return new Promise((resolve, reject) => {
    var file = fs.readFileSync(path);
    let img1 = JPEG.decode(file);
    resolve(img1);
  })
}


const run = async () => {

  let successCount = 0;
  let testImgCount = 0;
  let lastIndex = 0;
  for (let n = 0; n < filesTest.length; n++) {
    if (filesTest[n].startsWith(".")) {
      continue;
    }
    testImgCount++;
    for (let i = lastIndex; i < filesOrigin.length; i++) {
      if (filesOrigin[i].startsWith(".")) {
        continue;
      }
      let imgs = await Promise.all([readImage(`${pathOrigin}/${filesOrigin[i]}`), readImage(`${pathTest}/${filesTest[n]}`)])
      let result = doneReading(filesOrigin[i],filesTest[n], imgs[0], imgs[1])
      if (result) {
        successCount++;
        lastIndex = i;
        break;
      }
    }
  }
  if(successCount==testImgCount){
    console.log("test result:","same content video")
  }else{
    console.log("test result:","different content video")
  }
  console.log("test finished use time:", Date.now() - startTime)
}


const doneReading=(name1,name2, img1, img2) =>{
  let start = Date.now();
  let diff = new PNG({width: img1.width, height: img1.height});

  let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: PIXEL_MATCH_THRESHOLD});

  console.log('numDiffPixels:', name1+'-'+name2+':'+numDiffPixels+' use time:'+(Date.now()-start))
  if (numDiffPixels <= THRESHOLD_PIXELS_COUNT) {
    diff.pack().pipe(fs.createWriteStream('diff/diff-' + name1 + '-'+name2+'.png'));
    return true;
  } else {
    return false;
  }
}

let startTime = Date.now();
shell.exec(command.videoResolutionCommand('video/origin.mp4'),function (result,resolution) {
  let resolutionArray = resolution.split("x");
  let width = resolutionArray[0];
  let height = resolutionArray[1];
  let startX = width/2-50;
  let startY = height/2-50;
  let crop = `100:100:${startX}:${startY}`

  shell.exec(command.videoResolutionCommand('video/test.mp4'),function (testResult,testTestRolution) {

    let testResolutionArray = testTestRolution.split("x");
    let testWidth = testResolutionArray[0];
    let testHeight = testResolutionArray[1];
    let testStartX = testWidth/2-50;
    let testStartY = testHeight/2-50;
    let testCrop = `100:100:${testStartX}:${testStartY}`

    let exportOriginImage = command.exportFrameImage('video/origin.mp4','dist/origin/p%04d.jpg','100x100',null,crop)
    shell.exec(exportOriginImage.replace("\n",""), function () {
      let exportTest = command.exportFrameImage('video/test.mp4','dist/test/p%04d.jpg','100x100','eq(n,1)',testCrop);
      shell.exec(exportTest.replace("\n","").replace("\n",""), function () {
        filesOrigin = fs.readdirSync(pathOrigin);
        filesTest = fs.readdirSync(pathTest);
        run()
      })
    })
  });
})

