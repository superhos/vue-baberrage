<template>
  <div id="app">
    <vue-baberrage
      :isShow= "barrageIsShow"
      :barrageList = "barrageList"
      :loop = "barrageLoop"
      >
    </vue-baberrage>
    <div class="demo-control">
      <select v-model="position">
        <option value="top">从上</option>
        <option value="abc">从右</option>
      </select>
      <input type="text" style="float:left"  v-model="msg" />
      <button type="button" style="float:left" @click="addToList">Add</button>
      <button type="button" style="float:left" @click="removeList">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Hello World!vue-baberrage 2.0!',
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
          msg: this.msg,
          barrageStyle: 'top',
          time: 8,
          type: 1,
          position: 'top'
        })
      } else {
        this.barrageList.push({
          id: ++this.currentId,
          avatar: './static/avatar.jpg',
          msg: this.msg,
          time: 8,
          type: 0
        })
      }
    }
  }
}
</script>

<style lang="scss">
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
  position:absolute;
  left:40%;
  width:20%;
  bottom:300px;
  background:rgba(0,0,0,.6);
  padding:15px;
  border-radius:5px;
  border:2px solid #8ad9ff;

  input,button,select{
    height:35px;
    padding:0;
    float:left;
    background:#027fbb;
    border:1px solid #CCC;
    color:#FFF;
    border-radius:0;
    width:15%;
  }

  input{
    width:50%;
    height:33px;
    background:rgba(0,0,0,.7);
    border:1px solid #8ad9ff;
    color:#FFF;
  }

}

</style>
