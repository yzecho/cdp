
import {getMenuTree} from '@/common/api';
import router from "../router";

import {
  Message,
  MessageBox
} from 'element-ui'

const sysParam = {
}



export async function getMenuRouterData(){
   let menuRoutes =[];
  await getMenuTree().then(res=>{
    if(res.length==0){
      Message({
        message: '请给用户赋权！',
        type: 'error'
      });
    }

    menuRouterFormat(res,menuRoutes);
    sysParam['menuData']=menuRoutes;
    console.log(menuRoutes)
    sysParam['menuTreeData']=res;
    router.addRoutes([
       {
         path: '/',
         name:'index',
         redirect: menuRoutes[0].path,
         component:() =>import('@/common/views/index'),
         alias: '/index',
         children:menuRoutes
       }
     ])
    console.log("将变量添加至路由")
  }).catch(res=>{
    console.log(res+"：：：：添加全局变量报错")
  });
}

function menuRouterFormat(val,menuRoutes){
  //child为0，则说明是末子节点
  for(let i=0;i<val.length;i++) {
    let item=val[i];
    if (item.children.length == 0) {
      let node = item.node;
      menuRoutes.push({
        path: node.url,
        name: node.name,
        component: () => import('@/platform/views/' + node.name + ''),
        meta: { title: node.alias, icon: "dashboard"}
      })
    } else {
      menuRouterFormat(item.children, menuRoutes)
    }
  }
}


getMenuRouterData();
export default sysParam;
