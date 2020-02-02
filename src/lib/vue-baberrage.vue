<template>
  <div class="baberrage-stage" v-show="isShow" ref="stage">
    <div class="baberrage-top">
      <VueBaberrageMsg  v-for="item in topQueue" :key="item.id" class="baberrage-item" :item="item" />
    </div>
    <!-- Normal -->
    <div class="baberrage-lane" v-for="lane in lanes" :key="lane.id">
      <VueBaberrageMsg  v-for="item in lane.laneQueue" :key="item.runtimeId" class="baberrage-item" :item="item" />
    </div>
    <div class="baberrage-bottom">
      <VueBaberrageMsg  v-for="item in bottomQueue" :key="item.id" class="baberrage-item" :item="item" />
    </div>
  </div>
</template>
<script>
import uuidv4 from 'uuid/v4'
import VueBaberrageMsg from './components/vue-baberrage-msg/index.vue'
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
    },
    // 放置函数
    posRender: {
      type: Function,
    }
  },
  data () {
    return {
      boxWidthVal: this.boxWidth,
      boxHeightVal: this.boxHeight,
      loopVal: this.loop,
      laneNum: 0, // 将舞台分为固定泳道，防止弹幕重叠
      lanes: [],
      startTime: 0,
      frameId: null,
      readyId: 0,
      topQueue: [], // 顶部队列
      bottomQueue: [], // 底部队列
      normalQueue: [], // 正常队列，新弹幕先进入队列，一定时限内再显示在ShowList
      showInd: 0, // 用指针来代替频繁环操作
      indexShowQueue: [], // 随机展示位置环
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

    this.setUpLane(this.boxHeightVal)
    this.shuffle()

    this.play()
  },
  watch: {
    barrageList (newBarrageList) {
      this.insertToReadyShowQueue()
    },
    boxHeight (newHeight) {
      this.setUpLane(newHeight)
    }
  },
  methods: {
    // 布置泳道
    setUpLane (newHeight) {
      // 舞台高度变化重新计算泳道
      if (newHeight === 0) {
        newHeight = this.$refs.stage.parentNode.offsetHeight
        newHeight = newHeight === 0 ? window.innerHeight : newHeight
      }

      this.boxHeightVal = newHeight
      const oldLaneNum = this.laneNum >>> 0
      this.laneNum = Math.floor(newHeight / (this.messageHeight + this.messageGap * 2))
      // 计算泳道数量
      if (oldLaneNum < this.laneNum) {
        for (let i = oldLaneNum; i < this.laneNum; i++) {
          this.lanes.push({
            id: i,
            laneQueue: []
          })
        }
      } else {
        this.lanes.splice(this.laneNum)
      }
    },
    // init indexShowQueue
    shuffle () {
      let len = this.laneNum
      // 按顺序展示
      this.indexShowQueue = Array.from({length: len}, (e, i) => i)
    },
    // 节流函数
    insertToReadyShowQueue () {
      clearTimeout(this.readyId)
      this.readyId = setTimeout(() => {
        while (this.barrageList.length > 0) {
          let current = this.barrageList.splice(0, this.laneNum)
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
              // 清理弹幕 防止内存泄漏
              if (!this.lanes[item.laneId]) return
              const indx = this.lanes[item.laneId].laneQueue.findIndex(e => e.runtimeId === item.runtimeId)
              this.lanes[item.laneId].laneQueue.splice(indx, 1)
              if (this.loopVal) {
                // 如果循环则重新加入数据
                this.itemReset(item, timestamp)
              } else {
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
    // 选择空闲可以插入的泳道
    selectPos () {
      // 如果有用户设置的函数函数则使用用户的
      if (this.posRender) {
        // 传入参数为当前所有泳道
        return this.posRender(this.lanes)
      } else {
        // 根据模式选择
        if (this.showInd + 1 > this.laneNum) {
          this.showInd = 0
        }
        return this.showInd++
      }
    },
    isWaiting (msg) {
      // 如果弹幕left大于舞台宽度 则判断为正在等待状态
      return msg.left > this.boxWidthVal
    },
    itemReset (item, timestamp) {
      item.runtimeId = uuidv4()
      item.type = item.type || MESSAGE_TYPE.NORMAL
      item.position = item.position || 'top'
      item.barrageStyle = item.barrageStyle || 'normal'
      item.startTime = timestamp
      item.currentTime = timestamp
      item.speed = this.boxWidthVal / (item.time * 1000)
      item.width = this.strlen(item.msg) * 9 + 20
      if (item.type === MESSAGE_TYPE.NORMAL) {
        let laneInd = this.selectPos()
        item.laneId = laneInd
        let lastLeft = this.boxWidthVal
        if (this.lanes[laneInd].laneQueue.length > 0) {
          const last = this.lanes[laneInd].laneQueue[this.lanes[laneInd].laneQueue.length - 1]
          if (last.left > this.boxWidthVal) {
            lastLeft = last.width + last.left
          } else {
            lastLeft += last.width
          }
        }
        this.lanes[laneInd].laneQueue.push(item)
        // 计算位置
        item.top = this.indexShowQueue[laneInd] * (this.messageHeight + this.messageGap * 2) - this.messageGap
        item.left = lastLeft
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

<style lang="less">
.baberrage-stage{
  position: absolute;
  width: 100%;
  height: 100%;
  overflow:hidden;
}
</style>
