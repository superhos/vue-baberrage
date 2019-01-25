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
</style>
