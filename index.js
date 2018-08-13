'use strict';

const fs = require('fs');
const JPEG = require('jpeg-js');
const PNG = require('pngjs').PNG;
const shell = require('shelljs');
const pixelmatch = require('pixelmatch');
const command = require('./lib/command')
const compare = require('./lib/compare')


shell.exec(command.videoResolutionCommand('video/origin.mp4'),{silent:true},function (result,resolution) {
  let resolutionArray = resolution.split("x");
  let width = resolutionArray[0];
  let height = resolutionArray[1];
  let startX = width/2-50;
  let startY = height/2-50;
  let crop = `100:100:${startX}:${startY}`

  shell.exec(command.videoResolutionCommand('video/test.mp4'),{silent:true},function (testResult,testTestRolution) {

    let testResolutionArray = testTestRolution.split("x");
    let testWidth = testResolutionArray[0];
    let testHeight = testResolutionArray[1];
    let testStartX = testWidth/2-50;
    let testStartY = testHeight/2-50;
    let testCrop = `100:100:${testStartX}:${testStartY}`

    let exportOriginImage = command.exportFrameImage('video/origin.mp4','dist/origin/p%04d.jpg','100x100',null,crop)
    shell.exec(exportOriginImage.replace("\n",""),{silent:true}, function () {
      let exportTest = command.exportFrameImage('video/test.mp4','dist/test/p%04d.jpg','100x100','eq(n,1)',testCrop);
      shell.exec(exportTest.replace("\n",""),{silent:true}, function () {

      })
    })
  });
})

