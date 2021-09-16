<template>
  <el-container id="all">
    <el-aside width="200px">
      <el-row class="tac">
        <el-col :span="24">
            <h5 style="text-align: center; color: #fff">便捷车场</h5>
          <el-menu
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
            <el-menu-item index="1" @click="menuClick('user', '用户管理')">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="2" @click="menuClick('park', '停车场管理')">
              <i class="el-icon-place"></i>
              <span slot="title">停车场管理</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <el-container>
      <el-header>
        <div  class="div-left" style="color: #fff">
          {{titleName}}
        </div>
        <div class="div-right">
          <span style="color: #fff">欢迎您：</span>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{user.name}}<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-switch-button" command="out">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import app from './App';

export default {
  name: "home",
  data() {
    return {
      titleName: "",
      user: null,
    }
  },
  beforeMount() {
    let getUser = localStorage.getItem("user");
    app.user = JSON.parse(getUser);
    if (app.user === null) {
      alert("请先登录！");
      this.$router.push({path:'/'});
    } else {
      this.user = app.user;
    }
    console.log(this.user);
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    menuClick(e, name) {
      this.$router.push({path:'/' + e})
      this.$data.titleName = name;
    },
    handleCommand(command) {
      if (command === 'out') {
        // 退出登录
        localStorage.removeItem("user");
        this.$message({message:'退出登录！', type:'success'});
        this.$router.push({path: '/'})
      }
    }
  },
}
</script>

<style scoped>
.el-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 100%;
  line-height: 60px;
}
.el-header .div-left{
  float: left;
  text-align: left;
}
.el-header .div-right{
  text-align: right;
}
.el-container .el-aside {
  /*text-align: center;*/
}

.el-container .el-main {
  background-color: #E9EEF3;
  color: #333;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  /*text-align: center;*/
}

body > .el-container {
  height: 100%;
}

html, body, #all{
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>