import request from '@/utils/request'
import {post,post_array} from '@/utils/request'

export default {
  namespaced:true,
  state:{
    orders:[],
    visible:false,
    title:"添加顾客信息",
    loading:false,
    waiters:[],
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
    }
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
    async getWaiterIds(context){
        let response = await request.get("/waiter/findAll");
        console.log(response)
        let waiters = response.data
            
        console.log(waiters)
        context.commit("refreshWaiterList",waiters)
        
    },
    async sendWork(context,params){
      console.log(params)
      let response = await request.get("/order/sendOrder",params);
      console.log(response.message)
      context.dispatch("findAllOrders")
  },
    async deleteOrderById(context,id){
      let response = await request.get("/order/deleteById?id="+id);
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