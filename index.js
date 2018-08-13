'use strict';

const shell = require('shelljs');
const command = require('./lib/command')

let videoPath = 'video';
let distOriginPath = 'dist/origin';
let distTestPath = 'dist/test'

shell.exec(command.videoResolutionCommand(`${videoPath}/origin.mp4`),{silent:true},function (result,resolution) {
  let resolutionArray = resolution.split("x");
  let width = resolutionArray[0];
  let height = resolutionArray[1];
  let startX = width/2-50;
  let startY = height/2-50;
  let crop = `100:100:${startX}:${startY}`

  shell.exec(command.videoResolutionCommand(`${videoPath}/test.mp4`),{silent:true},function (testResult,testTestRolution) {

    let testResolutionArray = testTestRolution.split("x");
    let testWidth = testResolutionArray[0];
    let testHeight = testResolutionArray[1];
    let testStartX = testWidth/2-50;
    let testStartY = testHeight/2-50;
    let testCrop = `100:100:${testStartX}:${testStartY}`

    let exportOriginImage = command.exportFrameImage(`${videoPath}/origin.mp4`,`${distOriginPath}/p%04d.jpg`,'100x100',null,crop)
    shell.exec(exportOriginImage.replace("\n",""),{silent:true}, function () {
      let exportTest = command.exportFrameImage(`${videoPath}/test.mp4`,`${distTestPath}/p%04d.jpg`,'100x100','eq(n,1)',testCrop);
      shell.exec(exportTest.replace("\n",""),{silent:true}, function () {
      })
    })
  });
})

