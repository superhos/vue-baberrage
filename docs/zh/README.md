# vue-baberrage 1.2.0

[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Vue.js 弹幕插件

![old_version](https://raw.githubusercontent.com/superhos/vue-baberrage/master/screenshot/old_demo.gif)

## 设计概念

有人问到为什么没有提供全局调用的插入弹幕方法，初衷是因为希望弹幕数据部分还是交由Vuex中心状态去管理。

## 安装

1) Install package via NPM

```bash
npm install vue-baberrage
```
2) Install plugin within project

```javascript
import Vue from 'vue'
import vueBaberrage from 'vue-baberrage'
Vue.use(vueBaberrage);
```
or

```javascript
const vueBaberrage = request('vue-baberrage');
```

or

```html
<script src="./dist/vue-baberrage.js"></script>
```

## 使用

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
        // barrageStyle: "normal",
        time: 5,
        type: 0,
        position: 'bottom'
      });
  ...
```

3) Already done

两步即可， 当有新的数据加入到`barrageList`，就会以弹幕形式展现出来，建议`barrageList`放在Vuex中。

## 插件选项

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

#### loop
	- Default: `false`
	- Acceptable-Values: Boolean
	- Function: 是否循环

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
	- Default: `0`
	- Acceptable-Values: Number
	- Function: 弹幕的类型
				0 ： 正常从右到左滚动
				1 ： 固定在弹幕区域上方

#### position
	- Default: `top`
	- Acceptable-Values: Boolean
	- Function: 目前为固定值，之后功能更新。

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

## Log

#### Version 0.0.1
- 实现基本功能.

#### Version 1.0.0
- 性能优化。

#### Version 1.2.0
- 代码规范。
- 性能优化。