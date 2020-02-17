<template>
  <div class="baberrage-item" v-bind:class="item.barrageStyle" v-bind:style="item.style">
    <template v-if="isCustom">
      <slot></slot>
    </template>
    <div v-else class="normal">
      <div class="baberrage-avatar"><img :src="item.avatar"></div>
      <div class="baberrage-msg">{{ item.msg }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vue-baberrage-message',
  props: {
    item: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      isCustom: false // 弹幕格式是否是自定义
    }
  },
  mounted () {
    this.isCustom = !!this.$scopedSlots.default
  }
}
</script>

<style lang="less">
.baberrage-item {
  position: absolute;
  width:auto;
  display:block;
  color:#000;
  transform: translateX(500%);
  padding:5px 0 5px 0;
  box-sizing: border-box;
  text-align:left;
  white-space:nowrap;

  .normal {
    display: flex;
    box-sizing: border-box;
    padding: 5px;

    .baberrage-avatar {
      width:30px;
      height:30px;
      border-radius:50px;
      overflow: hidden;

      img {
        width:30px;
      }
    }
  }

  .baberrage-msg{
    line-height:30px;
    padding-left:8px;
    white-space:nowrap;
  }
}

.baberrage-item .normal{
  background:rgba(0,0,0,.7);
  border-radius:100px;
  color:#FFF;
}
</style>
