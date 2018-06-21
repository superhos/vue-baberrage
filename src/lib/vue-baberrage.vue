<template>
  <div class="baberrage-stage" v-show="isShow" ref="stage">
    <div class="baberrage-top">
      <div v-for="item in topQueue" :id="'barrage_top_' + item.id" v-if="item.isMoving" :style="item.style" :key="item.id" class="baberrage-item" :class="item.barrageStyle">
        <div class="baberrage-avatar"><img :src="item.avatar"></div>
        <div class="baberrage-msg">{{ item.msg }}</div>
      </div>
    </div>
    <div v-for="item in barrageList" :id="'barrage_right_' + item.id" :style="item.style" :key="item.id"  class="baberrage-item" :class="item.barrageStyle">
      <div class="baberrage-avatar"><img :src="item.avatar"></div>
      <div class="baberrage-msg">{{ item.msg }}</div>
    </div>
    <div class="baberrage-bottom">
      <div v-for="item in bottomQueue" :id="'barrage_bottom_' + item.id" :key="item.id" :style="item.style" class="baberrage-item" :class="item.barrageStyle">
        <div class="baberrage-avatar"><img :src="item.avatar"></div>
        <div class="baberrage-msg">{{ item.msg }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vue-baberrage',
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    barrageList: {
      type: Array,
      default () {
        return []
      }
    },
    boxWidth: {
      type: Number,
      default: 0
    },
    boxHeight: {
      type: Number,
      default: 0
    },
    loop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      boxWidthVal: this.boxWidth,
      boxHeightVal: this.boxHeight,
      loopVal: this.loop,
      startTime: 0,
      transitionend: null,
      frameId: null,
      topQueue: [], // 顶部队列
      bottomQueue: [], // 底部队列
      cssPool: [],//CSS池
    }
  },
  mounted () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

    window.cancelAnimationFrame = window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame || function (requestID) { clearTimeout(requestID) }

    if (this.boxWidthVal === 0) {
      this.boxWidthVal = this.$refs.stage.parentNode.offsetWidth + 50
    }

    if (this.boxHeightVal === 0) {
      this.boxHeightVal = this.$refs.stage.parentNode.offsetHeight
      this.boxHeightVal = this.boxHeightVal === 0 ? window.innerHeight : this.boxHeightVal
    }

    this.taskLoop();
    this.play()
  },
  watch: {
    barrageList (newBarrageList) {
      this.updateBarrageDate()
    }
  },
  methods: {
    // 更新弹幕数据
    updateBarrageDate () {
      //开始移动
      this.moving()
      if (!(this.barrageList.length > 0 || this.topQueue.length > 0 || this.bottomQueue.length > 0)) {
        // 如果弹幕序列为空发出事件 barrageListEmpty
        this.$emit('barrage-list-empty')
      }
    },
    moving () {
      for (var i in this.barrageList){
        var item = this.barrageList[i];
        if (item.isMoving === undefined){
          this.itemReset(item);
          item.barrageStyle = ' normal ' + this.packageCSS(item.top,item.width,item.time);//'move'+item.time;
          this.$set(item, 'style', {
            width: item.width + 'px'
          })
          item.isMoving = true;
          var _this = this;
          this.$nextTick(function () {
            _this.moveEnd(item);
          })
        }
      }
    },
    packageCSS (y,width,time) {
        //使用随机css池中的css
        var id = Math.floor(Math.random() * 30 + 1);
        if (this.cssPool[id]){
          return 'move_' + id;
        }
        this.addKeyFrames(
            '.move_' + id,
            'animation-duration: '+time+'s;' + 
            'transition-timing-function: linear;' +
            'animation-name: moving_' + id + ';' + 
            'animation-fill-mode: forwards;',
            true
        );
        this.addKeyFrames(
            'moving_' + id,
            '0%{transform:translate3d('+this.boxWidthVal+'px,'+y+'px,0)}' + 
            '99%{transform:translate3d(-'+(width+200)+'px,'+y+'px,0);opacity:1;}' +
            '100%{transform:translate3d(-'+(width+200)+'px,'+y+'px,0);opacity:0;}'
        );
        this.cssPool[id] = true;
        return 'move_' + id;
    },
    addKeyFrames (name,frames,css) {
      var myReuseableStylesheet = document.createElement('style');//('style'), addKeyFrames = null;
      document.head.appendChild( myReuseableStylesheet );
      if (!window.createPopup) { /* For Safari */
        myReuseableStylesheet.appendChild(document.createTextNode(''));
      }
      var styleSheet = myReuseableStylesheet;
      if (css){
        styleSheet.innerHTML +=  name + "{" + frames + "}";
      }else{
        styleSheet.innerHTML += "@keyframes " + name + "{" + frames + "}";
      }
    },
    moveEnd (item) {
      
    },
    taskLoop () {
      this.frameId = requestAnimationFrame(this.checkBarrageList);
    },
    checkBarrageList (timestamp) {
      var item;
      for (var i in this.barrageList){
        item = this.barrageList[i];
        if (item.startTime == undefined && item.isMoving){
          item.startTime = timestamp;
        }
        if ((timestamp - item.startTime)/1000 > item.time){
          this.barrageList.splice(i,1);
        }
      }
      this.taskLoop();
    },
    // 暂停弹幕
    pause () {
      cancelAnimationFrame(this.frameId)
    },
    // 重设弹幕
    replay () {
      for (var item of this.barrageList) {
        item.startTime = null
      }
      this.play()
    },
    // 固定弹幕
    fixMove (item, timestamp) {
      // 判断是否在队列中
      if (this[item.position + 'Queue'].indexOf(item) === -1) {
        this[item.position + 'Queue'].push(item)
      }
    },
    itemReset (item, timestamp) {
      // this.id= null;
      // this.avatar= '#';
      // this.msg= null;
      // this.barrageStyle= 'normal';
      // this.time= 10;//单位秒;默认10秒
      // this.type= '0';// 0:滚动 1:固定
      // this.position = 'normal'; // normal:随机 top:顶部 bottom:底部

      item.type = (typeof item.type === 'undefined') ? 0 : parseInt(item.type)
      item.position = (typeof item.position === 'undefined') ? 'right' : item.position
      item.barrageStyle = (typeof item.barrageStyle === 'undefined') ? 'normal' : item.barrageStyle
      item.startTime = timestamp
      item.currentTime = timestamp
      item.speed = this.boxWidthVal / (item.time * 1000)
      item.width = this.strlen(item.msg) * 9 + 50
      if (item.type === 0) {
        item.left = this.boxWidthVal
        item.top = parseInt(Math.random() * this.boxHeightVal)
      } else {
        item.left = (this.boxWidthVal - item.width) / 2
        if (item.position === 'top') {
          item.top = this[item.position + 'Queue'].length * 45 + 5
        } else {
          item.top = this.boxHeightVal - (this[item.position + 'Queue'].length * 45 + 100)
        }
      }
    },
    // ========================= Tools ===========================
    extend (defaultSetting, option) {
      for (var key in option) {
        defaultSetting[key] = option[key]
      }

      return defaultSetting
    },
    // 计算中英文的长度
    strlen (str) {
      var len = 0
      for (var i in str) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
          len += 2
        } else {
          len++
        }
      }
      return len
    }
  }
}

</script>

<style lang="scss">
.baberrage-stage{
  position: absolute;
    width: 100%;
    height: 100%;
    overflow:hidden;

    .baberrage-item {
      position: absolute;
      width:auto;
      display:block;
      color:#000;
      padding:5px 8px;
      text-align:left;

      .baberrage-avatar {
        float:left;
        width:30px;
        height:30px;
        border-radius:50px;
        overflow: hidden;

        img {
          width:30px;
        }
      }

      .baberrage-msg{
        float:left;
        line-height:30px;
        padding-left:8px;
      }
    }

    .baberrage-item.normal{
      background:rgba(0,0,0,.7);
      border-radius:100px;
      color:#FFF;
    }
}

.move-old {
  animation-duration: 8s;
  animation-name: moving;
}

@keyframes moving-old {
  from {
    transform: translate3d(130%, 300px, 0px);
  }

  to {
    transform: translate3d(-30%, 300px, 0px);
    opacity: 0;
  }
}

</style>
