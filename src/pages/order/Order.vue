<template>
  <div class="order">
		<!-- 按钮 -->
		<div>
			<el-button @click="toAddHandler" size="small" type="primary">添加</el-button>
			<el-button @click="batchDeleteHandler"  size="small" type="danger">批量删除</el-button>
		</div>
		<!-- 表格 -->
		<div v-loading="loading">
      <el-table :data="orders" size="mini"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="total" label="总数"></el-table-column>
        <el-table-column prop="customerId" label="发布人详情"></el-table-column>
        <el-table-column prop="addressId" label="地址"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="record">
               <el-button v-if="record.row.status=='待接单'" type="primary" size="mini" @click="showModal1(record.row.id)">接单</el-button> 
               <el-button v-if="record.row.status=='待派单'" type="success" size="mini">派单</el-button> 
          </template>
        </el-table-column>
      </el-table>
		</div>
    <!-- 模态框1 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form :model="order" :rules="rules" ref="orderForm">
        
        <el-form-item label="总数" label-width="100px" prop="telephone">
          <el-input v-model="order.total" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发布人id" label-width="100px" prop="telephone">
          <el-input v-model="order.customerId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="100px" prop="telephone">
          <el-input v-model="order.addressId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="telephone">
          <el-input v-model="order.status" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 模态框2 -->
    <el-dialog
        title="选择服务员"
        :visible.sync="dialogVisible1"
        width="30%"
       >
        <el-select v-model="sendData1.waiterId" placeholder="请选择">
            <el-option
            v-for="item in waiters"
            :key="item.id"
            :label="item.realname"
            :value="item.id">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="sendWork(sendData1)">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import { get } from 'http';
export default {
  data(){
    return {
      order:{},
      sendData1:{},
      dialogVisible1:false,
      ids:[],
    //   rules:{
    //     realname: [
    //       { required: true, message: '请输入姓名', trigger: 'blur' },
    //       { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    //     ],
    //     telephone: [
    //       { required: true, message: '请输入手机号', trigger: 'blur' }
    //     ]
    //   }
    }
  },
  computed:{
    ...mapState("order",["orders","visible","title","loading","waiters"]),
    ...mapGetters("order",["orderOrder","orderSize"])
  },
  created(){
    this.findAllOrders();
  },
  methods:{
    ...mapMutations("order",["showModal","closeModal","setTitle"]),
    ...mapActions("order",["findAllOrders","saveOrUpdateOrder","deleteOrderById","batchDeleteOrder","getWaiterIds","sendWork"]),
    // 普通方法
    showModal1(data){
        this.dialogVisible1=true;
        this.sendData1.orderId = data;
        this.getWaiterIds()
    },
    handleSelectionChange(val) {
      this.ids = val.map(item=>item.id);
    },
    toAddHandler(){
      // 1. 重置表单
      this.order = {};
      this.setTitle("添加订单信息");
      // 2. 显示模态框
      this.showModal();
    },
    submitHandler(){
      // 校验
      this.$refs.orderForm.validate((valid)=>{
        // 如果校验通过
        if(valid){
          let promise = this.saveOrUpdateOrder(this.order)
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
      this.$refs.orderForm.resetFields();
    },
    editHandler(row){
      this.order = row;
      this.setTitle("修改顾客信息");
      this.showModal();
    },
    deleteHandler(id){
      this.deleteOrderById(id)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    batchDeleteHandler(){
      this.batchDeleteOrder(this.ids)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    }

  }

}
</script>
<style scoped>

</style>