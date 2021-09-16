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
        :row-class-name="tableRowClassName"
        style="width: 100%">
      <el-table-column
          type="index"
          width="50">
      </el-table-column>
      <el-table-column
          property="phone"
          label="账号"
          width="120">
      </el-table-column>
      <el-table-column
          property="password"
          label="密码"
          width="120">
      </el-table-column>
      <el-table-column
          property="name"
          label="名称">
      </el-table-column>
      <el-table-column
          property="openId"
          label="openid">
      </el-table-column>
        <el-table-column
           property="state" label="用户类型">
          <template slot-scope="scope">
            <p v-if="scope.row.state === 0">管理员</p>
            <p v-if="scope.row.state === 1">车场主用户</p>
            <p v-if="scope.row.state === 2">车主用户</p>
          </template>
        </el-table-column>
      <el-table-column
          property="address"
          label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="showUpdate(scope.row), updateVisible = true"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加管理员用户" :visible.sync="addVisible" width="20%">
      <el-form :model="addFrom">
        <el-form-item label="账号">
          <el-input v-model="addFrom.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addFrom.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="addFrom.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser(), addVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户信息" :visible.sync="updateVisible" width="20%">
      <el-form :model="updateFrom">
        <el-form-item label="账号">
          <el-input v-model="updateFrom.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="updateFrom.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="updateFrom.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser(), updateVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

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
    tableRowClassName({rowIndex}){
      if (rowIndex === 0) {
        return 'success-row';
      }
      if ((rowIndex + 1) % 2 === 0) {
        return 'warning-row';
      } else if ((rowIndex + 1) % 3 === 0) {
        return 'success-row';
      }
      return '';
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    queryUser(){
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'admin/listByParam',
        data: {param: that.param}
      }).then(function(res){
        if (res.data.code === 0) {
          that.tableData = res.data.list;
        } else {
          that.$message.error(res.data.msg);
        }
      })
    },
    addUser() {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'admin/adminRegister',
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
        that.$message.error('添加失败' + e);
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
        url: localStorage.getItem("url") + 'admin/updateUser',
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
        that.$message.error('修改失败' + e);
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
          url: localStorage.getItem("url") + 'admin/deleteUser?id=' + e,
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
          that.$message.error('修改失败！' + e);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>