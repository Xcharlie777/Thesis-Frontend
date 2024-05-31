<template>
  <div class="main">
    <div class="left">
      <span class="el-icon-cloudy" style="font-weight: bold; margin-right: 5px; font-size: 25px"></span>
      <span>My<b>PaaS</b></span>
    </div>
    <div class="right">
      <div v-if="this.$store.state.userID === 0">
        <el-button plain round size="mini" class="register-button" @click="register"> 注册 </el-button>
        <el-button plain round size="mini" class="login-button" @click="login"> 登录 </el-button>
      </div>
      <div v-else style="display: flex; align-items: center">
        <span class="el-icon-user" style="color: white; margin-right: 5px; font-size: 20px"></span>
        <span style="font-size: 18px; margin-right: 15px"> {{ this.$store.state.username }} </span>
        <span style="margin-right: 15px"> | </span>
        <span>
          <el-link :underline="false" class="logout-link" @click="logout"> 退出登录 </el-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '@/router';

  export default {
    components: {},
    data() {
      return {};
    },
    methods: {
      register() {
        router.push({ path: '/register' });
      },

      login() {
        router.push({ path: '/login' });
      },

      logout() {
      this.$store.commit('setUserID', 0);
      this.$store.commit('setUsername', '');
        this.$message.success('已退出登录');
        router.push({ path: '/login' });
      },
    },
  };
</script>

<style scoped>
  .main {
    width: 100%;
    height: 100%;
    background-color: #3c3c3c;
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .left {
    margin-left: 30px;
    margin-top: 3px;
    font-size: 22px;
    display: flex;
    align-items: center;
  }

  .right {
    margin-right: 20px;
  }

  .register-button {
    font-size: 15px;
    background-color: #3c3c3c;
    border-width: 4px;
    border-color: white;
    color: white;
  }

  .register-button:hover {
    background-color: #3c3c3c !important;
    border-color: #e1e1e1 !important;
    color: #e1e1e1 !important;
  }

  .register-button:active {
    background-color: #3c3c3c !important;
    border-color: white !important;
    color: white !important;
  }

  .login-button {
    font-size: 15px;
    border-width: 4px;
    border-color: white;
  }

  .login-button:hover {
    background-color: #e1e1e1 !important;
    border-color: #e1e1e1 !important;
    color: #000 !important;
  }

  .login-button:active {
    background-color: white !important;
    border-color: white !important;
    color: #000 !important;
  }

  .logout-link {
    font-size: 15px;
    color: #ddd;
  }

  .logout-link:hover {
    font-size: 15px;
    color: #1fc0a8;
  }
</style>
