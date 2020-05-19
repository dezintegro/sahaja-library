import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "start" */ './views/MainSearch.vue'),
    },
    {
      path: '/search/:query',
      name: 'searchResult',
      component: () => import(/* webpackChunkName: "search-result" */ './views/SearchResult.vue'),
    },
    {
      path: '/lection/:lectionId',
      name: 'lectionView',
      component: () => import(/* webpackChunkName: "search-result" */ './views/LectionView.vue'),
    },
    // {
    //   path: '/*', redirect: '/',
    // },
  ],
});
