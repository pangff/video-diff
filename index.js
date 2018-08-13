'use strict';

const shell = require('shelljs');
const command = require('./lib/command')

let videoPath = 'video';
let distOriginPath = 'dist/origin';
let distTestPath = 'dist/test'


const getCropInfo=(path)=>{
  return new Promise((resolve,reject)=>{
    shell.exec(command.videoResolutionCommand(path),{silent:true},function (result,resolution){
      let resolutionArray = resolution.split("x");
      let width = resolutionArray[0];
      let height = resolutionArray[1];
      let startX = width/2-50;
      let startY = height/2-50;
      let crop = `100:100:${startX}:${startY}`
      resolve(crop)
    });
  })
}

/**
 * 获取视频帧数
 * @param path
 * @returns {Promise<any>}
 */
const getFrameCount=(path)=>{
  return new Promise((resolve,reject)=>{
    shell.exec(command.videoFrameCount(path),{silent:true},function (result,count){
      resolve(count.replace('\n',''))
    });
  })
}

const exportFrameImages = (path,output,needResolution,selectFrame,crop)=>{
  return new Promise((resolve,reject)=>{
    let exportTest = command.exportFrameImage(path,output,needResolution,selectFrame,crop);
    shell.exec(exportTest.replace("\n",""),{silent:true}, function (result,message) {
      if(result==0){
        resolve(`export ${path} frame images to ${output} success`)
      }else{
        resolve(`export ${path} frame images to ${output} failed ${message}`)
      }
    })
  })
}

(async ()=>{
  let infoResults = await Promise.all([
    getCropInfo(`${videoPath}/origin.mp4`),
    getCropInfo(`${videoPath}/test.mp4`),
    getFrameCount(`${videoPath}/origin.mp4`),
    getFrameCount(`${videoPath}/test.mp4`)
  ]);

  console.log(infoResults)

  let originCrop = infoResults[0];
  let testCrop = infoResults[1];
  let originFrameCount = infoResults[2];
  let testFrameCount = infoResults[3];
  let useFrameCount = originFrameCount-testFrameCount;

  let exprotResults = await Promise.all([
    exportFrameImages(`${videoPath}/origin.mp4`,`${distOriginPath}/p%04d.jpg`,'100x100',null,originCrop),
    exportFrameImages(`${videoPath}/test.mp4`,`${distTestPath}/${useFrameCount}-p%04d.jpg`,'100x100','eq(n,1)',testCrop)
  ])

  console.log(exprotResults)
})();



