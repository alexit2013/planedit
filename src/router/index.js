import Vue from 'vue'
import Router from 'vue-router'
import PurchasePlanEdit from '@/components/PurchasePlanEdit'
import PurchasePlanAnalysis from '@/components/PurchasePlanAnalysis'
Vue.use(Router);
var myRouter = new Router({
  routes: [{
      path: '/',
      name: 'PurchasePlanEdit',
      component: PurchasePlanEdit,
    },
    {
      path: '/PurchasePlanAnalysis',
      component:PurchasePlanAnalysis,

    },
  ]
});

export default myRouter;