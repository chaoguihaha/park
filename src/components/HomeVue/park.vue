<template>
  <div>
    <el-button type="primary" @click="addVisible = true">添加车位信息</el-button>
    <el-button type="primary" @click="queryPark()" style="float: right;">搜索</el-button>
    <el-input v-model="param" placeholder="请输入搜索内容" style="float: right; width: 300px; margin-bottom: 20px"></el-input>
    <el-select v-model="value"  placeholder="请选择绑定情况" style="float: right;width: 100px">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
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
          property="number"
          label="车位编号"
          width="120">
      </el-table-column>
      <el-table-column
          property="address"
          label="车位地址"
          width="500">
      </el-table-column>
      <el-table-column
          property="message"
          label="车位信息"
          width="300">
      </el-table-column>
      <el-table-column
          label="操作">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
          <el-button type="primary" icon="el-icon-edit" circle @click="showUpdate(scope.row), updateVisible = true"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
          <el-button type="danger" icon="el-icon-delete" circle @click="deletePark(scope.row.id)"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="查看绑定信息" placement="top-start" v-if="scope.row.uId != null">
          <el-button type="warning" icon="el-icon-s-custom" circle @click="showUser(scope.row), userVisible = true"></el-button>
        </el-tooltip>
      </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加车位信息" :visible.sync="addVisible" width="30%">
      <el-form :model="addFrom">
        <el-form-item label="编号">
          <el-input v-model="addFrom.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addFrom.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="信息">
          <el-input v-model="addFrom.message" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识码">
          <el-input v-model="addFrom.key" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPark(), addVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改车位信息" :visible.sync="updateVisible" width="30%">
      <el-form :model="updateFrom">
        <el-form-item label="编号">
          <el-input v-model="updateFrom.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="updateFrom.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="信息">
          <el-input v-model="updateFrom.message" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识码">
          <el-input v-model="updateFrom.key" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePark(), updateVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="绑定用户信息" :visible.sync="userVisible" width="30%">
      <el-form :model="userFrom">
        <el-form-item label="账号">
          <el-input v-model="userFrom.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="userFrom.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="openid">
          <el-input v-model="userFrom.openId" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="danger" @click="unbindUser(), userVisible = false">解 绑</el-button>
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
  name: "water",
  data() {
    return {
      tableData: [],
      currentRow: null,
      param: "",
      addFrom: {},
      addVisible: false,
      updateFrom: {},
      updateVisible: false,
      userVisible: false,
      userFrom: {},
      options: [{
          value: '',
          label: '所有'
        },{
        value: '1',
        label: '未绑定'
      }, {
        value: '2',
        label: '已绑定'
      }],
      value: ''
    }
  },
  created() {
    this.queryPark()
  },
  methods: {
    tableRowClassName({rowIndex}){
      console.log(rowIndex)
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
    queryPark(){
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'admin/parkingList',
        data: {
          word: that.param,
          uId: that.value
        }
      }).then(function(res){
        if (res.data.code === 0) {
          that.tableData = res.data.list;
        } else {
          that.$message.error(res.data.msg);
        }
      })
    },
    addPark() {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'admin/addPark',
        data: that.addFrom
      }).then(function(res){
        if (res.data.code === 0) {
          that.$message.success("添加成功！");
          that.queryPark();
        } else {
          that.$message.error(res.data.msg);
        }
      }).finally(() =>{
        this.userVisible = false;
        this.userFrom = {};
      })
    },
    showUpdate(e){
      this.updateFrom = e;
    },
    updatePark() {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'admin/updatePark',
        data: that.updateFrom
      }).then(function(res){
        if (res.data.code === 0) {
          that.$message.success("修改成功！");
          that.queryPark();
        } else {
          that.$message.error(res.data.msg);
        }
      })
      that.updateFrom = {};
    },
    deletePark(e) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let that = this;
        axios({
          method:'POST',
          url: localStorage.getItem("url") + 'admin/deletePark?id=' + e,
        }).then(function(res){
          if (res.data.code === 0) {
            that.$message.success("删除成功！");
            that.queryPark();
          } else {
            that.$message.error(res.data.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showUser(e) {
      this.userFrom = e;
    },
    unbindUser() {
      this.$confirm('此操作将解除绑定, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let that = this;
        axios({
          method:'POST',
          url: localStorage.getItem("url") + 'admin/unbindParking?id=' + this.userFrom.id,
        }).then(function(res){
          if (res.data.code === 0) {
            that.$message.success("解绑成功！");
            that.queryPark();
          } else {
            that.$message.error(res.data.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      }).finally(() => {
        this.userFrom = {};
        this.userVisible = false;
      });
    }
  }
}
</script>

<style scoped>

</style>