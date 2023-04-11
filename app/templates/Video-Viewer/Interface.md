1.获取全部视频流URL

接口：/allvideolist

类型：GET

传参：

```
无
```

返回值:

```javascript
data=[url1,url2.....];
```

2.获取单个视频流图片组

接口：/videoimage

类型：GET

传参：

```javascript
videoid=id;
```

返回值:

```javascript
data=[base64,base64.....];
```

3.视频流列表增加

接口：/videolistadd

类型：POST

传参：

```javascript
{
    "列表字段1"："值1",
    "列表字段2"："值2",
    "列表字段3"："值3",
    ......
}
```

返回值:

```javascript
data="Success"/"Fail";
```

4.视频流列表删除

接口：/videolistdelete

类型：POST

传参：

```javascript
videoid=id;
```

返回值:

```javascript
data="Success"/"Fail";
```

5.视频流列表修改

接口：/videolistupdate

类型：POST

传参：

```javascript
{
    "列表字段1"："值1",
    "列表字段2"："值2",
    "列表字段3"："值3",
    ......
}
```

返回值:

```javascript
data="Success"/"Fail";
```

6.视频流列表查询

接口：/videolistquery

类型：GET

传参：

```javascript
无
```

返回值:

```javascript
data=[
  	 {
    "列表字段1"："值1",
    "列表字段2"："值2",
    "列表字段3"："值3",
    ......
},
     {
    "列表字段1"："值1",
    "列表字段2"："值2",
    "列表字段3"："值3",
    ......
},
     {
    "列表字段1"："值1",
    "列表字段2"："值2",
    "列表字段3"："值3",
    ......
},
];
```















