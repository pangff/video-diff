'use strict';

/**
 * 视频分辨率命令
 * @param filename
 * @returns {string}
 */
exports.videoResolutionCommand = (filename)=>{
  let command = `ffmpeg -i ${filename} 2>&1 |grep 'Video' |grep -o '[[:digit:]]\\{3,5\\}x[[:digit:]]\\{3,5\\}'`
  console.log('command:',command)
  return command;
}

/**
 * 导出指定帧的图片
 * @param filename
 * @param output
 * @param resolution
 * @param select
 * @returns {string}
 */
exports.exportFrameImage = (filename,output,resolution,select,crop)=>{
  let command;
  if(select && crop){
     command = `ffmpeg -i ${filename} -vf "select='${select}',crop='${crop}'"  -vsync 0 -s ${resolution} ${output}`
  }else if(select){
     command = `ffmpeg -i ${filename} -vf "select='${select}'" -vsync 0 -s ${resolution} ${output}`
  }else if(crop){
     command = `ffmpeg -i ${filename} -vf crop="${crop}" -vsync 0 -s ${resolution} ${output}`
  }else{
     command = `ffmpeg -i ${filename} -s ${resolution} ${output}`
  }
  console.log('command:',command)
  return command;
}
