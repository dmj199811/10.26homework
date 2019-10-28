<template>
  <div class="parduct">
		<!-- 按钮 -->
		<div>
			<el-button @click="toAddHandler" size="small" type="primary">添加</el-button>
			<el-button @click="batchDeleteHandler"  size="small" type="danger">批量删除</el-button>
		</div>
    <el-input style="width:300px;margin:10px" @blur="search" v-model="sea"></el-input>
    <el-button @click="search" size="small" type="warning">搜索</el-button>
		<!-- 表格 -->
		<div v-loading="loading">
      <el-table :data="useData.list" size="mini"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="照片">
          <template #default="record">
            <img :src="record.row.photo" alt="" height="30px">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="record">
              <i class="el-icon-delete" href="" @click.prevent="deleteHandler(record.row.id)"></i> &nbsp;
							<i class="el-icon-edit-outline" href="" @click.prevent="editHandler(record.row)"></i> &nbsp;
          </template>
        </el-table-column>
      </el-table>
		</div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form :model="product" :rules="rules" ref="waiterForm">
        <el-form-item label="姓名" label-width="100px">
          <el-input v-model="product.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px" >
          <el-input v-model="product.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-input v-model="product.status" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100px">
          <el-input type="textarea" v-model="product.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 模态框2 -->

    <!-- 分页 -->
    <el-pagination
    background
    layout="prev, pager, next"
    :total="useData.total" :page-size="param.pageSize" :current-page="param.page+1" @current-change="pageChangeHandler1">
    </el-pagination>
  </div>
</template>
<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  data(){
    return {
      product:{},
      sea:"",
      ids:[],
      rules:{
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    ...mapState("pro",["products","waiters","visible","title","loading","useData","param"]),
    ...mapGetters("pro",["orderWaiter","waiterSize"])
  },
  created(){
    this.loadProducts();
    this.findAllProducts()
  },
  methods:{
    ...mapMutations("pro",["search1","showModal","closeModal","setTitle"]),
    ...mapActions("pro",["loadProducts","pageChangeHandler1","findAllProducts","saveOrUpdateProduct","deleteProductById","batchDeleteProduct"]),
    // 普通方法
    search(){
      console.log(1)
      this.search1(this.sea)
    },
    handleSelectionChange(val) {
      this.ids = val.map(item=>item.id);
    },
    toAddHandler(){
      // 1. 重置表单
      this.product = {};
      this.setTitle("添加顾客信息");
      // 2. 显示模态框
      this.showModal();
    },
    submitHandler(){
      // 校验
      this.$refs.waiterForm.validate((valid)=>{
        // 如果校验通过
        if(valid){
          let promise = this.saveOrUpdateProduct(this.product)
          promise.then((response)=>{
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({type:"success",message:response.statusText});
          })
        } else {
          return false;
        }
      })
    },
    dialogCloseHandler(){
      this.$refs.waiterForm.resetFields();
    },
    editHandler(row){
      this.product = row;
      this.setTitle("修改顾客信息");
      this.showModal();
    },
    deleteHandler(id){
      this.deleteProductById(id)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    batchDeleteHandler(){
      this.batchDeleteProduct(this.ids)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    }

  }

}
</script>
<style scoped>

</style>