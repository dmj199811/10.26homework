<template>
  <div class="customerDetails">
    <h2>顾客详情</h2>
    <el-button size="small" type="primary" @click="backHandler" style="position:absolute;top:20px;right:100px;">返回</el-button>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
        <el-table :data="useData1" style="width: 100%">
          <el-table-column
            prop="id"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="telephone"
            label="电话"
            width="180">
          </el-table-column>
          <el-table-column
            prop="realname"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="password"
            label="密码"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="180">
          </el-table-column>
          <el-table-column
           
            label="照片"
            width="180">
                <template >
                  <img :src="useData1[0].photo" :alt="useData1[0].photo" style="width: 50px;height: 50px">
                </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="orders">
        <el-table
        :data="orderDatas"
        style="width: 100%">
          <el-table-column
            prop="total"
            label="总数"
            width="180">
          </el-table-column>
          <el-table-column
            prop="customerId"
            label="用户id"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="180">
          </el-table-column>
          <el-table-column
            prop="orderTime"
            label="下单时间" 
            :formatter="dateFormat" 
            width="180">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="服务地址" name="address">
        <el-table :data="address">
          <el-table-column label="省" prop="province"></el-table-column>
          <el-table-column label="市" prop="city"></el-table-column>
          <el-table-column label="区" prop="area"></el-table-column>
          <el-table-column label="街道" prop="address"></el-table-column>
          <el-table-column label="手机号" prop="telephone"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
  data(){
    return {
      activeName:"info",
      useData1:[],
      filterData:[]
    }
  },
  created(){
    this.useData1[0]=this.$route.query;
    let id = this.$route.query.id;
    // 通过id查询顾客，订单，地址
    this.findAddressByCustomerId(id);
    this.findAllOrders(id)
    
  },
  computed:{
    ...mapState("address",["address"]),
    ...mapState("customer",["orderDatas"])
  },
  methods:{
    ...mapActions("address",["findAddressByCustomerId"]),
    ...mapActions("customer",["findAllOrders"]),
    dateFormat(row, column){
    var moment = require('moment');
    var date = row[column.property];
    return moment(date).format("YYYY-MM-DD")
    },
    backHandler(){
      // this.$router.push("/customer")
      this.$router.go(-1)
    },
    
  }

}
</script>
<style scoped>


</style>