import request from '@/utils/request'
import {get,post,post_array} from '@/utils/request'

export default {
  namespaced:true,
  state:{
    orders:[],
    visible:false,
    title:"添加顾客信息",
    loading:false,
    waiters:[],
    useData:{},
    param:{
      page:0,
      pageSize:5,
    },
  },
  getters:{
    orderSize(state){
      return state.orders.length;
    },
    orderOrder:(state)=>{
      return function(flag){
        state.orders.sort((a,b)=>{
          if(a[flag] > b[flag]){
            return -1;
          } else {
            return 1;
          }
        })
        return state.orders;
      }
    }
  },
  mutations:{
    showModal(state){
      state.visible = true;
    },
    closeModal(state){
      state.visible = false;
    },
    refreshOrders(state,orders){
      state.orders = orders;
    },
    setTitle(state,title){
      state.title = title;
    },
    beginLoading(state){
      state.loading = true;
    },
    endLoading(state){
      state.loading = false;
    },
    refreshWaiterList(state,data){
      state.waiters = data
      console.log(state.waiters)
    },
    refreshUseData(state,data){
      state.useData = data
      console.log(state.useData)
    },
    refreshParam(state,date){
      state.param.page=date-1
      console.log(state.param.page)
    }
    // modalClose2(state){
    //   state.dialogVisible3=false
    // },
    // modalShow2(state){
    //   state.dialogVisible3=true
    // }
  },
  actions:{
    async batchDeleteOrder(context,ids){
      // 1. 批量删除
      let response = await post_array("/order/batchDelete",{ids})
      // 2. 分发
      context.dispatch("findAllOrders");
      // 3. 返回结果
      return response;
    },
    async pageChangeHandler(context,page){
      await context.commit("refreshParam",page)
      
      context.dispatch("loadOrders",context.state.param) 
    },
    async loadOrders(context,data){
      console.log("出来了")
      console.log(data)
      let response = await post("/order/queryPage",context.state.param)
      console.log(response.data)
      context.commit("refreshUseData",response.data)
    },
    async getWaiterIds(context){
        let response = await request.get("/waiter/findAll");
        console.log(response)
        let waiters = response.data
        console.log(waiters)
        context.commit("refreshWaiterList",waiters)
    },
    async getOrder(context,data){
      console.log("接单了")
      var data = "orderId="+data.id+"&waiterId="+data.waiterId;
      console.log(data)
      let response = await request.get("/order/takeOrder?"+data)
      context.dispatch("findAllOrders")
      context.dispatch("loadOrders")
    },
    async cancelOrder(context,data){
      console.log("取消")
      let response = await request.get("/order/cancelSendOrder?orderId="+data)
      context.dispatch("findAllOrders")
      context.dispatch("loadOrders")
    },
    async sendOrder(context,data){
      console.log("派单了")
      var data1 = "orderId="+data.orderId+"&waiterId="+data.waiterId;
      let response = await request.get("/order/sendOrder?"+data1)
      console.log(response.statusText)
      context.dispatch("findAllOrders")
      context.dispatch("loadOrders")
    },
    async finishOrder(context,data){
      console.log("结束")
      var data1 = "orderId="+data.id+"&waiterId="+data.waiterId;
      console.log(data1)
      let response = await request.get("/order/serviceCompleted?"+data1)
      console.log(response.statusText)
      context.dispatch("findAllOrders")
    },

    async deleteOrderById(context,id){
      console.log(1)
      let response = await request.get("/order/deleteById?id="+id);
      console.log(2)
      context.dispatch("findAllOrders");
      return response;
    },
    async findAllOrders({dispatch,commit}){
      // 1. ajax查询
      commit("beginLoading");
      let response = await request.get("/order/findAll");
      // 2. 将查询结果更新到state中
      commit("refreshOrders",response.data);
      setTimeout(()=>{
        commit("endLoading")
      },1000)
    },
    // payload 顾客信息
    async saveOrUpdateOrder({commit,dispatch},payload){
      // 1. 保存或更新
      let response = await post("/order/saveOrUpdate",payload)
      // 2. 刷新页面
      dispatch("findAllOrders");
      // 3. 关闭模态框
      commit("closeModal");
      // 4. 提示
      return response;
    }
  }
}