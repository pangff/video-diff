# video-diff
视频对比

## 方案说明

* 通过ffmpeg将原视频按帧导出图片
* 通过ffmpeg将修改后的待验证视频抽取5帧导出与原视频导出图片相同分辨率的图片
* 将待验证视频抽取待5帧图片与原视频全部图片进行像素匹配
* 如果待验证待视频5张帧图片均在原视频帧图片中匹配则认为待测试视频与原视频是同内容视频

## Mac环境安装ffmpeg

```
brew install ffmpeg
```

## 运行视频比对

```
node index.js
```

## 运行结果

* 在dist/origin生成原视频导出图片
* 在dist/test生成待验证导出图片
* 在控制台日志输出视频是否为相同视频日志及时间等内容
* 在diff目录生成相互匹配图片不同等像素点图片（相互匹配不代表图片像素完全一致，而是不同的像素点数量在可容忍范围内容）

## 注意事项

代码中的两个配置

```
const THRESHOLD_PIXELS_COUNT = 100000;//最大可容忍不同像素点数（相互匹配不代表图片像素完全一致，而是不同的像素点数量在可容忍范围内容）
const PIXEL_MATCH_THRESHOLD = 0.1;//PIXEL_MATCH点的比对严格程度（0-1），值越小比对越严格发现的不同像素点越多。
```
