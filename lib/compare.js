'use strict';

const fs = require('fs');
const JPEG = require('jpeg-js');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const mapReduce = require('mapred')(2);

const THRESHOLD_PIXELS_COUNT = 0;//最大可容忍不同像素点数
const PIXEL_MATCH_THRESHOLD = 0.1;//PIXEL_MATCH点的比对严格程度（0-1），值越小比对越严格发现的不同像素点越多。


const readImage=(path)=> {
  var file = fs.readFileSync(path);
  let img1 = JPEG.decode(file);
  return img1
}


const run = async (filesOrigin,filesTest) => {
  let startTime = Date.now();
  mapReduce(filesOrigin,function (key,values) {
    let sameCount = 0;
    let lastIndex = 0;
    for (let n = 0; n < filesTest.length; n++) {
      let testFileNameArray = filesTest[n].split("/");
      let maxCompareFrame = testFileNameArray[testFileNameArray.length-1].split('-')[0];
      console.log('maxCompareFrame:',maxCompareFrame)
      for (let i = lastIndex; i < maxCompareFrame; i++) {
        let img1 = readImage(`${values[i]}`)
        let img2 = readImage(`${filesTest[n]}`)
        let originFileNameArray = values[i].split("/");
        let originFileName = originFileNameArray[originFileNameArray.length-1];
        let testFileName = testFileNameArray[testFileNameArray.length-1];
        let result = doneReading(originFileName,testFileName, img1, img2)
        if (result) {
          lastIndex = i;
          sameCount++;
          break;
        }
      }
    }
    return [[key,sameCount]];
  },function (key,values) {
    let sameCount = 0;
    for(let i=0;i<values.length;i++){
      sameCount++;
    }
    return  sameCount>0;
  },function (result) {

    let keys = Object.keys(result);
    let isSame = false;
    keys.forEach((key)=>{
      isSame = isSame || result[key];
    })
    console.log(result)
    let count =  result.count
    console.log("test result:","same content video:>>"+isSame)
    console.log("test finished use time:", Date.now() - startTime)
  });
}


const doneReading=(name1,name2, img1, img2) =>{
  let start = Date.now();
  let diff = new PNG({width: img1.width, height: img1.height});

  let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: PIXEL_MATCH_THRESHOLD});

  console.log('numDiffPixels:', name1+'-'+name2+':'+numDiffPixels+' use time:'+(Date.now()-start))
  if (numDiffPixels <= THRESHOLD_PIXELS_COUNT) {
    // diff.pack().pipe(fs.createWriteStream('diff/diff-' + name1 + '-'+name2+'.png'));
    return true;
  } else {
    return false;
  }
}

const setupAndRun = (originPath,testPath)=>{
  let filesOrigin = fs.readdirSync(originPath);
  let originMap = [];
  let originEven = []
  let originOdd = []
  filesOrigin.forEach((item,index)=>{
    if(!item.startsWith(".")){
      if(index%2==0){
        originEven.push(originPath+"/"+item)
      }else{
        originOdd.push(originPath+"/"+item)
      }
    }
  })
  originMap.push(["even",originEven])
  originMap.push(["odd",originOdd])

  let filesTest = fs.readdirSync(testPath);
  let testData = [];
  filesTest.forEach((item,index)=>{
    if(!item.startsWith(".")){
      testData.push(testPath+"/"+item)
    }
  })

  run(originMap,testData)
}

setupAndRun('dist/origin','dist/test')
