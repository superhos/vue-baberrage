<template>
  <div class="baberrage-item" v-bind:class="item.barrageStyle" v-bind:style="item.style">
    <div class="baberrage-avatar"><img :src="item.avatar"></div>
    <div class="baberrage-msg">{{ item.msg }}</div>
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
    }
  }
}
</script>

<style lang="scss">
.baberrage-item {
  position: absolute;
  width:auto;
  display:block;
  color:#000;
  transform: translateX(500%);
  padding:5px 8px 5px 38px;
  text-align:left;
  white-space:nowrap;

  .baberrage-avatar {
    position: absolute;
    width:30px;
    height:30px;
    left: 8px;
    top: 5px;
    border-radius:50px;
    overflow: hidden;

    img {
      width:30px;
    }
  }

  .baberrage-msg{
    line-height:30px;
    padding-left:8px;
    white-space:nowrap;
  }
}

.baberrage-item.normal{
  background:rgba(0,0,0,.7);
  border-radius:100px;
  color:#FFF;
}
</style>
