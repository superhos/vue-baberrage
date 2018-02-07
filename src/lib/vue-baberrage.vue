<template>
  <div class="baberrage-stage" v-show="isShow" ref="stage">
    <div class="baberrage-top">
      <div v-for="item in topQueue" v-bind:style="item.style" v-bind:key="item.id" class="baberrage-item" v-bind:class="item.barrageStyle">
        <div class="baberrage-avatar"><img :src="item.avatar"></div>
        <div class="baberrage-msg">{{ item.msg }}</div>
      </div>
    </div>
    <div v-for="item in barrageList" v-bind:style="item.style" v-bind:key="item.id"  class="baberrage-item" v-bind:class="item.barrageStyle">
      <div class="baberrage-avatar"><img :src="item.avatar"></div>
      <div class="baberrage-msg">{{ item.msg }}</div>
    </div>
    <div class="baberrage-bottom">
      <div v-for="item in bottomQueue" v-bind:key="item.id" v-bind:style="item.style" class="baberrage-item" v-bind:class="item.barrageStyle">
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
      frameId: null,
      topQueue: [], // 顶部队列
      bottomQueue: [] // 底部队列
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

    this.play()
  },
  watch: {
    barrageList (newBarrageList) {
      this.updateBarrageDate()
    }
  },
  methods: {
    // 更新弹幕数据
    updateBarrageDate (timestamp) {
      if (this.startTime == null) this.startTime = timestamp
      if (typeof timestamp !== 'undefined') {
        this.move(timestamp)
      }
      if (this.barrageList.length > 0 || this.topQueue.length > 0 || this.bottomQueue.length > 0) {
        this.play()
      } else {
        // 如果弹幕序列为空发出事件 barrageListEmpty
        this.$emit('barrage-list-empty')
      }
    },
    // 开始弹幕
    play () {
      this.frameId = requestAnimationFrame(this.updateBarrageDate)
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
    // 弹幕移动
    move (timestamp) {
      for (var i in this.barrageList) {
        var item = this.barrageList[i]
        if (typeof item.startTime !== 'undefined') {
          if (item.type === 0) {
            // 正常弹幕
            this.normalMove(item, timestamp)
            // 退出条件
            if (item.left + item.width < 0) {
              if (this.loopVal) {
                // 如果循环则不删除数据
                this.itemReset(item, timestamp)
              } else {
                // 不循环则删除数据
                this.barrageList.splice(i, 1)
              }
            }
          } else {
            if (item.position !== 'top' && item.position !== 'bottom') {
              throw new Error('Position only between top and bottom when the type equal 1')
            }
            // 固定弹幕
            this.fixMove(item, timestamp)
            this.barrageList.splice(i, 1)
          }
        } else {
          // 弹幕初始化
          this.itemReset(item, timestamp)
        }
      }

      // 更新队列
      this.queueRefresh(timestamp)
    },
    // 正常移动
    normalMove (item, timestamp) {
      // 时间差
      var progress = timestamp - item.currentTime
      item.currentTime = timestamp
      // 移动距离
      var moveVal = item.speed * progress

      // 如果移动距离为0或者NaN 跳过，保持动画连续和减少重绘
      if (moveVal <= 0 || isNaN(moveVal)) return
      item.left -= moveVal
      // 设置移动
      this.$set(item, 'style', {
        transform: 'translate3d(' + item.left + 'px,' + item.top + 'px,0px)',
        width: item.width + 'px'
      })
    },
    // 固定弹幕
    fixMove (item, timestamp) {
      // 判断是否在队列中
      if (this[item.position + 'Queue'].indexOf(item) === -1) {
        this[item.position + 'Queue'].push(item)
      }
    },
    // 队列数据刷新
    queueRefresh (currentTime) {
      var item
      for (var i in this.topQueue) {
        item = this.topQueue[i]
        if (item.startTime + item.time * 1000 <= currentTime) {
          this.topQueue.shift()
        }
      }
      for (var j in this.bottomQueue) {
        item = this.bottomQueue[j]
        if (item.startTime + item.time * 1000 <= currentTime) {
          this.bottomQueue.shift()
        }
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
      item.position = (typeof item.position === 'undefined') ? 'top' : item.position
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
      this.$set(item, 'style', {
        transform: 'translate3d(' + item.left + 'px,' + item.top + 'px,0)'
      })
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
</style>
