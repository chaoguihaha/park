<template>
  <div id="card">

    <img id = "logo" alt="Vue logo" src="../assets/logo.png">

    <el-form :model="user" ref="user" label-width="auto" class="demo-dynamic">
      <el-form-item
          prop="username"
          label="账号"
          :rules="[
            { required: true, message: '请输入账号', trigger: 'blur' }
          ]"
      >
        <el-input v-model="user.username" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item
          prop="password"
          label="账号"
          :rules="[
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]"
      >
        <el-input placeholder="请输入密码" v-model="user.password" show-password></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('user')" style="width: 100%">登  录</el-button>
    </el-form>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "login",
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            method:'POST',
            url: localStorage.getItem("url") + 'user/adminLogin',
            data: that.user
          }).then(function(res){
            if (res.data.code === 0) {
              that.$message({
                message : '登录成功',
                type: 'success'
              });
              localStorage.setItem("user", JSON.stringify(res.data.user));
              that.$router.push({path: '/home'})
            } else {
              that.$message.error(res.data.msg);
            }
          }).catch(function (e){
            that.$message.error('登录失败！');
            console.log(e);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
}

</script>

<style scoped>
/*.el-input{*/
/*  width: 250px;*/
/*}*/
/*.el-form .el-form-item {*/
/*  !*background-color: #B3C0D1;*!*/
/*  color: #333;*/
/*  text-align: center;*/
/*  line-height: 60px;*/
/*}*/
#logo{
  width: 100px;
  margin-left: 40%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-form {
  margin-left: 20%;
  width: 300px;
}
.el-form .el-button {
  margin-bottom: 30px;
}
#card{
  margin-top: 15%;
  margin-left: 35%;
  border-radius: 20px;
  width: 500px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: aliceblue;
}
</style>