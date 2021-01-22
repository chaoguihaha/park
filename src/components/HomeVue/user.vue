<template>
  <div>
    <el-button type="primary" @click="addVisible = true">添加用户</el-button>
    <el-button type="primary" @click="queryUser()" style="float: right;">搜索</el-button>
    <el-input v-model="param" placeholder="请输入搜索内容" style="float: right; width: 300px; margin-bottom: 20px"></el-input>
    <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
      <el-table-column
          type="index"
          width="50">
      </el-table-column>
      <el-table-column
          property="username"
          label="账号"
          width="120">
      </el-table-column>
      <el-table-column
          property="password"
          label="密码"
          width="120">
      </el-table-column>
      <el-table-column
          property="openid"
          label="openid">
      </el-table-column>
        <el-table-column
           property="state" label="用户类型">
          <template slot-scope="scope">
            <p v-if="scope.row.state === '0'">管理员</p>
            <p v-if="scope.row.state === '1'">普通用户</p>
          </template>
        </el-table-column>
      <el-table-column
          property="address"
          label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="showUpdate(scope.row), updateVisible = true"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="绑定信息" placement="top-start" v-if="scope.row.state ==='1'">
            <el-button type="warning" icon="el-icon-star-off" circle @click="showBind(scope.row.id), bindVisible = true"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加(添加管理员)" :visible.sync="addVisible" width="20%">
      <el-form :model="addFrom">
        <el-form-item label="账号">
          <el-input v-model="addFrom.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addFrom.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser(), addVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="updateVisible" width="20%">
      <el-form :model="updateFrom">
        <el-form-item label="账号">
          <el-input v-model="updateFrom.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="updateFrom.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser(), updateVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="绑定信息" :visible.sync="bindVisible">
      <template v-if="bindFrom !== []">
        <el-table :data="bindFrom">
          <el-table-column property="bNumber" label="编号"></el-table-column>
          <el-table-column property="bSite" label="地址"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="解除绑定" placement="top-start">
                <el-button type="danger" icon="el-icon-s-release" circle @click="cancelBind(scope.row.uId, scope.row.bNumber)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-if="bindFrom === []">
        查无绑定数据
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "user",
  data() {
    return {
      tableData: [],
      currentRow: null,
      param: "",
      addFrom: {state:0},
      addVisible: false,
      updateFrom: {},
      updateVisible: false,
      bindFrom: [],
      bindVisible: false,
    }
  },
  created() {
    this.queryUser();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    queryUser(){
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'user/listByParam',
        data: {param: that.param}
      }).then(function(res){
        if (res.data.code === 0) {
          that.tableData = res.data.page;
        } else {
          that.$message.error(res.data.msg);
        }
      })
    },
    addUser() {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'user/adminRegister',
        data: that.addFrom
      }).then(function(res){
        if (res.data.code === 0) {
          that.$message({
            message : '添加成功',
            type: 'success'
          });
          that.queryUser();
        } else {
          that.$message.error(res.data.msg);
        }
      }).catch(function (e){
        that.$message.error('添加失败');
        console.log(e);
      });
      that.addVisible = false;
    },
    showUpdate(e){
      this.updateFrom = e;
    },
    updateUser() {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'user/updateUser',
        data: that.updateFrom
      }).then(function(res){
        if (res.data.code === 0) {
          that.$message({
            message : '修改成功',
            type: 'success'
          });
          that.queryUser();
        } else {
          that.$message.error(res.data.msg);
        }
      }).catch(function (e){
        that.$message.error('修改失败');
        console.log(e);
      });
      that.updateVisible = false;
      that.updateFrom = {};
    },
    deleteUser(e) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let that = this;
        axios({
          method:'POST',
          url: localStorage.getItem("url") + 'user/deleteUser?id=' + e,
        }).then(function(res){
          if (res.data.code === 0) {
            that.$message({
              message : '删除成功！',
              type: 'success'
            });
            that.queryUser();
          } else {
            that.$message.error(res.data.msg);
          }
        }).catch(function (e){
          that.$message.error('修改失败！');
          console.log(e);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        });
      });
    },
    showBind(e) {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'user/queryAllWatch',
        data: {uid: e},
      }).then(function(res){
        if (res.data.code === 0) {
          that.bindFrom = res.data.watchList;
        } else {
          that.$message.error(res.data.msg);
        }
      });
    },
    cancelBind(uid, bNumber) {
      this.$confirm('此操作将解除绑定, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let that = this;
        axios({
          method:'POST',
          url: localStorage.getItem("url") + 'user/deleteBindMsg',
          data: {uid: uid, bNumber: bNumber},
        }).then(function(res){
          if (res.data.code === 0) {
            that.$message({
              type: 'success',
              message: '解除绑定成功!'
            });
            that.showBind(uid);
          } else {
            that.$message.error(res.data.msg);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>