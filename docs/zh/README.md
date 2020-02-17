
<h1 align="center">
  <br>
  <a href="#" style="border-radius:50px;padding:10px;box-sizing:border-box;background:#000;display:inline-block;" ><img src="https://raw.githubusercontent.com/superhos/vue-baberrage/master/docs/logo.png" alt="VueBaberrage" style="border-radius:150px;box-sizing:border-box;" width="200"></a>
  <br>
	<br>
</h1>

<h4 align="center">基于Vue.js弹幕插件</h4>
<p align="center">
<img alt="" src="https://img.shields.io/badge/vueBaberrage.js-3.2.0-green.svg">
<img alt="" src="https://img.shields.io/badge/vue.js-2.5.22-brightgreen.svg">
<img alt="" src="https://img.shields.io/badge/minified size-20kB-blue.svg">
<img alt="" src="https://img.shields.io/badge/License-MIT-orange.svg">
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#plugin-options">Plug Options</a> •
  <a href="#roadmap">Roadmap</a>
</p>

## Introduction

弹幕是中国较受欢迎的弹幕展示方式。

## Future

目前正在开发`Vue-Baberrage-Plus`，比较两个项目，`Vue-Baberrage`的定位是即开箱即用的小插件，而`Plus`则是一套完整的弹幕解决方案，包括会提供更流畅的展示方式，更丰富的交互方式，更完善的接入方式等。(2019-01-25)

## Overview

![new_version](https://raw.githubusercontent.com/superhos/vue-baberrage/master/screenshot/demo.gif)

GIF看起来效果太差了. 可以直接去 [DEMO](http://blog.chenhaotaishuaile.com/vue-baberrage/) 页看效果

## Demo

[DEMO](http://blog.chenhaotaishuaile.com/vue-baberrage/) 页

## Installation

1) Install package via NPM

```bash
npm install vue-baberrage
```
2) Install plugin within project

```javascript
import Vue from 'vue'
import { vueBaberrage } from 'vue-baberrage'
Vue.use(vueBaberrage)
```
or

```javascript
const vueBaberrage = request('vue-baberrage').vueBaberrage
```

or

```html
<script src="./dist/vue-baberrage.js"></script>
```

## Usage

1) Template
`isShow` and `barrageList` are necessary.

```html
<div id="app">
<vue-baberrage
      :isShow= "barrageIsShow"
      :barrageList = "barrageList"
      :loop = "barrageLoop"
      >
    </vue-baberrage>
</div>
```

2) Script

```javascript
import { MESSAGE_TYPE } from 'vue-baberrage'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Hello vue-baberrage',
      barrageIsShow: true,
      currentId : 0,
      barrageLoop: false,
      barrageList: []
    }
  },  
  methods:{
    addToList (){
      this.barrageList.push({
        id: ++this.currentId,
        avatar: "./static/avatar.jpg",
        msg: this.msg,
        time: 5,
        type: MESSAGE_TYPE.NORMAL,
      });
  ...
```

3) Already done

两步即可， 当有新的数据加入到`barrageList`，就会以弹幕形式展现出来，建议`barrageList`放在Vuex中。


## 自定义弹幕例子

这是一个在3.2.0版本新增加的功能，你能够以slot的形式定制自己的弹幕样式。
````javascript
<vue-babarrage
        ref="babarrage"
        :lanesCount="5"
        :boxHeight= "stageHeight"
        :isShow= "barrageIsShow"
        :barrageList = "barrageList"
        :loop = "barrageLoop"
        :maxWordCount = "60"
        :hoverLanePause = "hoverLanePause"
        >
        <span style="color: #000" slot-scope="props">
          {{props.item.msg}}
        </span>
	  </vue-babarrage>
````

通过组件的slot来自定义弹幕的样式。`props.item`的数据跟弹幕的数据一样。请注意，如果弹幕展现出来的宽度有所差异，请在弹幕数据中增加`extraWidth`来调整宽度。

````javascript
{
	id: ++this.currentId,
	avatar: "./static/avatar.jpg",
	msg: this.msg,
	time: 5,
	type: MESSAGE_TYPE.NORMAL,
	extraWidth: 60
}
````

因为vue-baberrage只通过弹幕的文字来计算弹幕的长度。

## Plugin Options

#### isShow
	- Default: `true`
	- Acceptable-Values: Boolean
	- Function: 是否显示弹幕

#### barrageList
	- Default: `[]`
	- Acceptable-Values: Array
	- Function: 弹幕数据列表

#### boxWidth
	- Default: `parent's Width`
	- Acceptable-Values: Number
	- Function: 显示弹幕区域的宽度

#### boxHeight
	- Default: `window's Height`
	- Acceptable-Values: Number
	- Function: 显示弹幕区域的高度

#### messageHeight
	- Default: `message's Height`
	- Acceptable-Values: Number
	- Function: 弹幕高度

#### maxWordCount
	- Default: `60`
	- Acceptable-Values: Number
	- Function: 弹幕最大字数长度，超过则忽略（中文占2长度，英文占1长度）

#### loop
	- Default: `false`
	- Acceptable-Values: Boolean
	- Function: 是否循环

#### throttleGap
	- Default: 2000
	- Acceptable-Values: Number
	- Function: 弹幕之间的节流时间

#### posRender
	- Default: null
	- Acceptable-Values: Function
	- Function: 自定义弹幕显示的泳道
	- Return: 需要返回泳道的索引

#### lanesCount
	- Default: 0
	- Acceptable-Values: Number
	- Function: 泳道的数量。

## 弹幕数据选项

#### id
	- Default: `null`
	- Acceptable-Values: Number
	- Function: 用以区分每条弹幕

#### avatar
	- Default: `#`
	- Acceptable-Values: String
	- Function: 弹幕的头像
	
#### msg
	- Default: `null`
	- Acceptable-Values: String
	- Function: 弹幕内容

#### barrageStyle
	- Default: `normal`
	- Acceptable-Values: String
	- Function: 额外的弹幕的样式

#### time
	- Default: `10`
	- Acceptable-Values: Number
	- Function: 弹幕展示的时间（单位：秒）

#### type
	- Default: MESSAGE_TYPE.NORMAL
	- Acceptable-Values: Symbol
	- Function: 弹幕的类型
				MESSAGE_TYPE.NORMAL ： 正常从右到左滚动
				MESSAGE_TYPE.FROM_TOP ： 固定在弹幕区域上方

#### position
	- Default: `top`
	- Acceptable-Values: Boolean
	- Function: 目前为固定值，之后功能更新。

#### extraWidth
	- Default: 0
	- Acceptable-Values: Number
	- Function: 弹幕的额外宽度。

## Events

当 `barrageList` 为空的时候会调用 `barrage-list-empty`。

```html
<vue-baberrage
	      :is-show= "barrageIsShow"
	      :barrage-list = "barrageList"
	      :loop = "barrageLoop"
	      @barrage-list-empty="sayHi"
	      >
```

## Roadmap

#### Version 0.0.1
- 实现基本功能.

#### Version 1.0.0
- 性能优化。

#### Version 1.2.0
- 代码规范。
- 性能优化。

#### Version 2.1.2
- 使用ES6.
- 性能优化。.

#### Version 2.1.9
- 增加节流函数

#### Version 3.1.0
- 改用Rollup打包
- 增加`posRender`属性
- 修复部分BUG

#### Version 3.2.0
- 支持自定义弹幕样式
- 修复部分BUG