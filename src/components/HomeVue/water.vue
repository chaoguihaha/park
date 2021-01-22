<template>
  <div>
    <el-button type="primary" @click="addVisible = true">添加水表</el-button>
    <el-button type="primary" @click="queryWater()" style="float: right;">搜索</el-button>
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
          property="waterNumber"
          label="编号"
          width="120">
      </el-table-column>
      <el-table-column
          property="waterSite"
          label="地址"
          width="500">
      </el-table-column>
      <el-table-column
          property="createTime"
          label="创建时间">
      </el-table-column>
      <el-table-column
          label="操作">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
          <el-button type="primary" icon="el-icon-edit" circle @click="showUpdate(scope.row), updateVisible = true"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteWater(scope.row.id)"></el-button>
        </el-tooltip>
      </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form :model="addFrom">
        <el-form-item label="地址">
          <el-input v-model="addFrom.waterSite" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWater(), addVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="updateVisible" width="30%">
      <el-form :model="updateFrom">
        <el-form-item label="编号">
          <el-input v-model="updateFrom.waterNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="updateFrom.waterSite" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="updateFrom.createTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateWater(), updateVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

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
    }
  },
  created() {
    this.queryWater()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    queryWater(){
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'water/findByValue',
        data: {
          waterNumber: that.param,
          waterSite: that.param
        }
      }).then(function(res){
        if (res.data.code === 0) {
          that.tableData = res.data.waters;
        } else {
          that.$message.error(res.data.msg);
        }
      })
    },
    addWater() {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'water/add',
        data: that.addFrom
      }).then(function(res){
        if (res.data.code === 0) {
          that.$message.success("添加成功！");
          that.queryWater();
        } else {
          that.$message.error(res.data.msg);
        }
      })
    },
    showUpdate(e){
      this.updateFrom = e;
    },
    updateWater() {
      let that = this;
      axios({
        method:'POST',
        url: localStorage.getItem("url") + 'water/update',
        data: that.updateFrom
      }).then(function(res){
        if (res.data.code === 0) {
          that.$message.success("修改成功！");
          that.queryWater();
        } else {
          that.$message.error(res.data.msg);
        }
      })
      that.updateFrom = {};
    },
    deleteWater(e) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let that = this;
        axios({
          method:'POST',
          url: localStorage.getItem("url") + 'water/delete?id=' + e,
        }).then(function(res){
          if (res.data.code === 0) {
            that.$message.success("删除成功！");
            that.queryWater();
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
    }
  }
}
</script>

<style scoped>

</style>