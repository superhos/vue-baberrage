# vue-baberrage 1.2.0

[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Barrage plugin for Vue.js

![old_version](https://raw.githubusercontent.com/superhos/vue-baberrage/master/screenshot/demo.gif)

[中文文档](/docs/zh/README.md)

## Installation

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

Just two step, and add new barrage message by pushing data into the `barrageList`. You needn't concern about the management of the barrageList, it will be handled by vue-baberrage. Suggest the `barrageList` store into the Vuex.

## Plugin Options

#### isShow
	- Default: `true`
	- Acceptable-Values: Boolean
	- Function: This is the switch that if barrage is displayed.

#### barrageList
	- Default: `[]`
	- Acceptable-Values: Array
	- Function: The is the container for managing the all barrage messages.

#### boxWidth
	- Default: `parent's Width`
	- Acceptable-Values: Number
	- Function: Determine the width of the stage.

#### boxHeight
	- Default: `window's Height`
	- Acceptable-Values: Number
	- Function: Determine the height of the stage.

#### loop
	- Default: `false`
	- Acceptable-Values: Boolean
	- Function: Loop or not.

## Barrage Message Options

#### id
	- Default: `null`
	- Acceptable-Values: Number
	- Function: For distinguish with other barrage messages.

#### avatar
	- Default: `#`
	- Acceptable-Values: String
	- Function: Show the avatar of the barrage message.
	
#### msg
	- Default: `null`
	- Acceptable-Values: String
	- Function: The content of the barrage message.

#### barrageStyle
	- Default: `normal`
	- Acceptable-Values: String
	- Function: the css class name of the barrage message.

#### time
	- Default: `10`
	- Acceptable-Values: Number
	- Function: How long does the barrage message show.(Seconds)

#### type
	- Default: `0`
	- Acceptable-Values: Number
	- Function: The type of the barrage message. 
				0 for scroll from right to left. 
				1 for fixed on the top or bottom of the stage.

#### position
	- Default: `top`
	- Acceptable-Values: Boolean
	- Function: Determine the position of the barrage message when the type is 0.

## Events

`barrage-list-empty` when the `barrageList` is empty will be called.

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
- Realized the basic functionality.

#### Version 1.0.0
- Performance improvement.

#### Version 1.2.0
- Code specification
- Performance improvement.