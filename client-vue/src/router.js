import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login';
import Panel from './components/Panel';

import Catalog from './components/Catalog';
import Categories from './components/Categories';
import Forms from './components/Forms';
import PanelStartPage from './components/PanelStartPage';


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'null',
      component: null
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/panel',
      component: Panel,
      children: [
      {
        path: '/panel',
        component: PanelStartPage
      },
      {
        path: '/panel/catalog',
        component: Catalog
      }, {
        path: '/panel/categories',
        component: Categories
      }, {
        path: '/panel/forms',
        component: Forms
      },
      ]
    },
    
    
  ]
});

router.replace({
  path: '/login',
  redirect: '/'
});

export default router;