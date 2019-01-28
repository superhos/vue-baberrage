<template>
  <div id="app">
    <div class="stage">
      <vue-baberrage
        :isShow= "barrageIsShow"
        :barrageList = "barrageList"
        :loop = "barrageLoop"
        :maxWordCount = "60"
        >
      </vue-baberrage>
    </div>
    <div class="demo-control">
      <div>
        <select v-model="position">
          <option value="top">从上</option>
          <option value="abc">从右</option>
        </select>
        <input type="text" style="float:left"  v-model="msg" />
        <button type="button" style="float:left" @click="addToList">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import { MESSAGE_TYPE } from './lib/index.js'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Hello World!vue-baberrage 2.1.0!',
      position: 'top',
      barrageIsShow: true,
      currentId: 0,
      barrageLoop: false,
      barrageList: []
    }
  },
  methods: {
    removeList () {
      this.barrageList = []
    },
    addToList () {
      if (this.position === 'top') {
        this.barrageList.push({
          id: ++this.currentId,
          avatar: './static/avatar.jpg',
          msg: this.msg + this.currentId,
          barrageStyle: 'top',
          time: 8,
          type: MESSAGE_TYPE.FROM_TOP,
          position: 'top'
        })
      } else {
        this.barrageList.push({
          id: ++this.currentId,
          avatar: './static/avatar.jpg',
          msg: this.msg,
          time: 15,
          type: MESSAGE_TYPE.NORMAL
        })
      }
    }
  }
}
</script>

<style lang="scss">
html, body, #app, .stage {
  width: 100%;
  height: 100%;
  margin: 0;
  position: relative;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.baberrage-stage .baberrage-item.normal{
  color:#FFF;
}

.top{
  border:1px solid #66aabb;
}

.demo-control{
    position: absolute;
    margin: 0 auto;
    width: 100%;
    bottom: 300px;
    top: 70%;
    height: 69px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    justify-content: center;

  div {
    width: 300px;
    background: rgba(0, 0, 0, 0.6);
    padding: 15px;
    border-radius: 5px;
    border: 2px solid #8ad9ff;
  }

  input,button,select{
    height:35px;
    padding:0;
    float:left;
    background:#027fbb;
    border:1px solid #CCC;
    color:#FFF;
    border-radius:0;
    width:18%;
    box-sizing: border-box;
  }

  select{
    height:33px;
    margin-top:1px;
    border: 0px;
    outline: 1px solid rgb(204,204,204);
  }

  input{
    width:64%;
    height:35px;
    background:rgba(0,0,0,.7);
    border:1px solid #8ad9ff;
    padding-left:5px;
    color:#FFF;
  }

}

</style>
