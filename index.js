'use strict';

const fs = require('fs');
const JPEG = require('jpeg-js');
const PNG = require('pngjs').PNG;
const shell = require('shelljs');
const pixelmatch = require('pixelmatch');

let pathOrigin = 'dist/origin';
let filesOrigin;

let pathTest = 'dist/test';
let filesTest;

const THRESHOLD_PIXELS_COUNT = 100000;//最大可容忍不同像素点数
const PIXEL_MATCH_THRESHOLD = 0.1;//PIXEL_MATCH点的比对严格程度（0-1），值越小比对越严格发现的不同像素点越多。

let exportImage = 'ffmpeg -i video/test.mp4 -vf "select=\'eq(n\,1)+eq(n\,20)+eq(n\,30)+eq(n\,40)+eq(n\,50)\'" -vsync 0 -s 640x1236  dist/test/p%04d.jpg';
let exportOriginImage = 'ffmpeg -i video/origin.mp4 -s 640x1236 dist/origin/p%04d.jpg'


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
  let startTime = Date.now();
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
  let diff = new PNG({width: img1.width, height: img1.height});

  let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: PIXEL_MATCH_THRESHOLD});

  console.log('numDiffPixels:', name1+'-'+name2+':'+numDiffPixels)
  if (numDiffPixels <= THRESHOLD_PIXELS_COUNT) {
    diff.pack().pipe(fs.createWriteStream('diff/diff-' + name1 + '-'+name2+'.png'));
    return true;
  } else {
    return false;
  }
}


shell.exec(exportOriginImage, function () {
  shell.exec(exportImage, function () {
    filesOrigin = fs.readdirSync(pathOrigin);
    filesTest = fs.readdirSync(pathTest);
    run()
  })
})
