<template>
  <div class="baberrage-stage" v-show="isShow" ref="stage">
    <div class="baberrage-top">
      <VueBaberrageMsg  v-for="item in topQueue" v-bind:key="item.id" class="baberrage-item" :item="item" />
    </div>
    <!-- Normal -->
    <VueBaberrageMsg  v-for="item in normalQueue" v-bind:key="item.id" class="baberrage-item" :item="item" />
    <div class="baberrage-bottom">
      <VueBaberrageMsg  v-for="item in bottomQueue" v-bind:key="item.id" class="baberrage-item" :item="item" />
    </div>
  </div>
</template>
<script>
import VueBaberrageMsg from './components/vue-baberrage-msg'
import { MESSAGE_TYPE } from './constants/index.js'
import { setTimeout } from 'timers'

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function (requestID) { clearTimeout(requestID) }

export default {
  name: 'vue-baberrage',
  components: {
    VueBaberrageMsg
  },
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
    // 每条弹幕的基本高度
    messageHeight: {
      type: Number,
      default: 40
    },
    messageGap: {
      type: Number,
      default: 5
    },
    loop: {
      type: Boolean,
      default: false
    },
    maxWordCount: {
      type: Number,
      default: 20
    },
    throttleGap: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      boxWidthVal: this.boxWidth,
      boxHeightVal: this.boxHeight,
      loopVal: this.loop,
      laneNum: 0, // 将舞台分为固定泳道，防止弹幕重叠
      startTime: 0,
      frameId: null,
      readyId: 0,
      topQueue: [], // 顶部队列
      bottomQueue: [], // 底部队列
      normalQueue: [], // 正常队列，新弹幕先进入队列，一定时限内再显示在ShowList
      randomInd: 0, // 用指针来代替频繁环操作
      randomShowQueue: [], // 随机展示位置环
      taskQueue: [],
      taskIsRunning: false,
      taskLastTime: null
    }
  },
  mounted () {
    // Calculate the size of Stage
    if (this.boxWidthVal === 0) {
      this.boxWidthVal = this.$refs.stage.parentNode.offsetWidth + 50
    }

    if (this.boxHeightVal === 0) {
      this.boxHeightVal = this.$refs.stage.parentNode.offsetHeight
      this.boxHeightVal = this.boxHeightVal === 0 ? window.innerHeight : this.boxHeightVal
    }

    this.laneNum = Math.floor(this.boxHeightVal / (this.messageHeight + this.messageGap * 2))
    this.shuffle()

    this.play()
  },
  watch: {
    barrageList (newBarrageList) {
      this.insertToReadyShowQueue()
    }
  },
  methods: {
    // init randomShowQueue
    shuffle () {
      let len = this.laneNum
      let i
      let temp
      let array = Array.from({length: len}, (e, i) => i)
      while (len > 0) {
        i = Math.floor(Math.random() * len--)
        temp = array[len]
        array[len] = array[i]
        array[i] = temp
      }
      this.randomShowQueue = array
    },
    // 节流函数
    insertToReadyShowQueue () {
      clearTimeout(this.readyId)
      this.readyId = setTimeout(() => {
        while (this.barrageList.length > 0) {
          let current = this.barrageList.splice(0, this.laneNum)
          // 判断长度
          // if (this.strlen(current.msg) === 0 || this.strlen(current.msg) > this.maxWordCount) continue
          // this.normalQueue.push(current)

          this.addTask(() => {
            this.normalQueue = [
              ...this.normalQueue,
              ...current
            ]
          })
        }
        this.updateBarrageDate()
      }, 300)
    },
    // 更新弹幕数据
    updateBarrageDate (timestamp) {
      if (this.startTime == null) this.startTime = timestamp
      if (typeof timestamp !== 'undefined') {
        this.move(timestamp)
      }
      if (this.normalQueue.length > 0 || this.topQueue.length > 0 || this.bottomQueue.length > 0) {
        // console.log('go play')
        this.play()
      } else {
        // 如果弹幕序列为空发出事件 barrageListEmpty
        this.$emit('barrage-list-empty')
        this.frameId = null
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
      this.normalQueue.forEach(item => { item.startTime = null })
      this.play()
    },
    // 弹幕移动
    move (timestamp) {
      this.normalQueue.forEach((item, i) => {
        if (item.startTime) {
          if (item.type === MESSAGE_TYPE.NORMAL) {
            // 正常弹幕
            this.normalMove(item, timestamp)
            // 退出条件
            if (item.left + item.width < 0) {
              if (this.loopVal) {
                // 如果循环则不删除数据
                this.itemReset(item, timestamp)
              } else {
                // 不循环则删除数据
                this.normalQueue.splice(i, 1)
              }
            }
          }
        } else {
          if (item.type === MESSAGE_TYPE.FROM_TOP) {
            if (item.position !== 'top' && item.position !== 'bottom') {
              throw new Error('Position only between top and bottom when the type equal 1')
            }

            // 固定弹幕
            this.fixMove(item, timestamp)
            this.normalQueue.splice(i, 1)
          }
          // 弹幕初始化
          this.itemReset(item, timestamp)
        }
      })

      // 更新队列
      this.queueRefresh(timestamp)
    },
    // 正常移动
    normalMove (item, timestamp) {
      // 时间差
      let progress = timestamp - item.currentTime
      item.currentTime = timestamp
      // 移动距离
      let moveVal = item.speed * progress

      // 如果移动距离为0或者NaN 跳过，保持动画连续和减少重绘
      if (moveVal <= 0 || isNaN(moveVal)) return
      item.left -= moveVal
      // 设置移动
      this.moveTo(item, {x: item.left, y: item.top})
    },
    // 固定弹幕
    fixMove (item, timestamp) {
      // 判断是否在队列中
      if (!this[item.position + 'Queue'].includes(item)) {
        this[item.position + 'Queue'].push(item)
      }
    },
    // 队列数据刷新
    queueRefresh (currentTime) {
      this.topQueue.forEach(item => {
        if (item.startTime + item.time * 1000 <= currentTime) {
          this.topQueue.shift()
        }
      })
      this.bottomQueue.forEach(item => {
        if (item.startTime + item.time * 1000 <= currentTime) {
          this.bottomQueue.shift()
        }
      })
    },
    itemReset (item, timestamp) {
      item.type = item.type || MESSAGE_TYPE.NORMAL
      item.position = item.position || 'top'
      item.barrageStyle = item.barrageStyle || 'normal'
      item.startTime = timestamp
      item.currentTime = timestamp
      item.speed = this.boxWidthVal / (item.time * 1000)
      item.width = this.strlen(item.msg) * 9 + 50
      if (item.type === MESSAGE_TYPE.NORMAL) {
        item.left = this.boxWidthVal
        // 选择位置
        let laneInd = this.randomInd === this.laneNum ? this.randomInd = 0 : this.randomInd++
        // 计算位置
        item.top = this.randomShowQueue[laneInd] * (this.messageHeight + this.messageGap * 2) - this.messageGap
      } else {
        item.left = (this.boxWidthVal - item.width) / 2
        if (item.position === 'top') {
          item.top = (this[item.position + 'Queue'].length - 1) * this.messageHeight + this.messageGap * 2
        } else {
          item.top = this.boxHeightVal - (this[item.position + 'Queue'].length * this.messageHeight + 100)
        }
      }
      this.moveTo(item, {x: item.left, y: item.top})
    },
    moveTo (item, {x, y}) {
      this.$set(item, 'style', {
        transform: 'translate3d(' + item.left + 'px,' + item.top + 'px,0)'
      })
    },
    addTask (fun) {
      this.taskQueue.push(fun)
      if (this.taskQueue.length > 0 && !this.taskIsRunning) {
        this.taskIsRunning = true
        window.requestAnimationFrame(this.runTask)
      }
    },
    runTask (time) {
      if (!this.taskLastTime || time - this.taskLastTime >= this.throttleGap) {
        let func = this.taskQueue.shift()
        this.taskLastTime = time
        func()
      }

      if (this.taskQueue.length > 0) {
        window.requestAnimationFrame(this.runTask)
      } else {
        this.taskIsRunning = false
      }
    },
    // ========================= Tools ===========================
    // 计算中英文的长度
    strlen (str) {
      let len = 0
      for (let i in str) {
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
}
</style>
