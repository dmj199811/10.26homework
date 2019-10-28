import request from '@/utils/request'
import {post,post_array} from '@/utils/request'

export default {
  namespaced:true,
  state:{
    products:[],
    visible:false,
    title:"添加产品信息",
    loading:false,
    orderDatas:[],
    useData:[],
    param:{
        page:0,
        pageSize:5,

    }
  },
  getters:{
    productSize(state){
      return state.productducts.length;
    },
    orderProduct:(state)=>{
      return function(flag){
        state.productducts.sort((a,b)=>{
          if(a[flag] > b[flag]){
            return -1;
          } else {
            return 1;
          }
        })
        return state.productducts;
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
    refreshProductducts(state,productducts){
      state.productducts = productducts;
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
    search(state,data){
      state.products = state.products.filter(function(item){
        
        if (item.name.indexOf(data)>0){

        }
        return item.name.indexOf(data)
      })
    },
    refreshOrders1(state,data){
      state.products = data
    },
    filterData1(state,id){
      data = state.orderDatas.filter(function(item){
        return item.productId=id
      })
      state.orderDatas = data
    },
    refreshUseData(state,data){
        state.useData = data
        console.log(state.useData)
    },
    refreshParam(state,date){
        state.param.page=date-1
        console.log(state.param.page)
    }
  },
  actions:{
    async batchDeleteProduct(context,ids){
      // 1. 批量删除
      let response = await post_array("/product/batchDelete",{ids})
      // 2. 分发
      context.dispatch("loadProducts");
      // 3. 返回结果
      return response;
    },
    async deleteProductById(context,id){
      let response = await request.get("/product/deleteById?id="+id);
      context.dispatch("loadProducts");
      return response;
    },
    async findAllProducts(context,id){
      // 1. ajax查询
      let response = await request.get("/product/findAll");
      // 2. 将查询结果更新到state中
      context.commit("refreshOrders1",response.data);
    },
    async loadProducts(context){
      console.log("出来了")
      let response = await post("/product/query",context.state.param)
      context.commit("refreshUseData",response.data)
    },
    async pageChangeHandler1(context,page){
      console.log(11)
      await context.commit("refreshParam",page)
      context.dispatch("loadProducts",context.state.param) 
    },
    async findAllProductducts({dispatch,commit}){
      // 1. ajax查询
      commit("beginLoading");
      let response = await request.get("/product/findAll");
      // 2. 将查询结果更新到state中
      commit("refreshProductducts",response.data);
      setTimeout(()=>{
        commit("endLoading")
      },1000)
    },
    // payload 顾客信息
    async saveOrUpdateProduct({commit,dispatch},payload){
      // 1. 保存或更新
      let response = await post("/product/saveOrUpdate",payload)
      // 2. 刷新页面
      dispatch("loadProducts");
      // 3. 关闭模态框
      commit("closeModal");
      // 4. 提示
      return response;
    }
  }
}