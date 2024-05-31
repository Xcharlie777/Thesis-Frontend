<template>
  <div class="outer">
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo menu"
      @select="handleSelect"
      background-color="#181B1F"
      text-color="#FFFFFF"
      active-text-color="#FFFFFF"
      >
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <span slot="title">实时负载</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-s-goods"></i>
        <span slot="title">常规测试选择</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-s-operation"></i>
        <span slot="title">常规测试结果</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-s-marketing"></i>
        <span slot="title">突发测试</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "sideIndex",
  data() {
    return {

    }
  },
  methods:{
    handleSelect(key) {
      if(key === '1'){
        this.$router.push("/nowload")
      }
      if(key === '2'){
        this.$router.push("/invoke")
      }
      if(key === '3'){
        this.$router.push("/result")
      }
      if(key === '4'){
        this.$router.push("/bursty")
      }
    },
  },
  computed:{
    activePath(){
      if(this.$route.path.split('/')[1]==='nowload' || this.$route.path==='/')
        return '1'
      else if(this.$route.path.split('/')[1]==='invoke')
        return '2'
      else if(this.$route.path.split('/')[1]==='result')
        return '3'
      else
        return '4'
    }
  },
}
</script>

<style scoped>
.outer {
  height: 100%;
  background-color: #181B1F;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu {
   width: 90%;
   margin-top: 10px;
   margin-right: 4px;
}

.el-menu-item {
  width: 103%;
  font-size: 15px;
}
.el-menu-item.is-active {
  background-color: #1FC0A8 !important;
  /* font-weight: bold !important; */
  width: 103%;
  border-radius: 5px;
}
</style>
