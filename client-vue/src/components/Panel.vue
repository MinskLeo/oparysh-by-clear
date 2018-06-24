<template>
  <div class="container Panel">
    <change-product-window v-if="isChangeWindowOpened"></change-product-window>
    <div class="container SignOut" @click="SignOut">
      <!-- Выйти из панели -->
      <i class="fas fa-door-open"></i>
    </div>
    <Sidebar></Sidebar>
    <router-view/>
  </div>
</template>

<script>
import AXIOS from '../axios-common';
import Sidebar from './Subcomponents/Sidebar';
import ChangeProductWindow from './ChangeProductWindow';
import CookieManager from '../cookieManager';

export default {
  name: 'mainpanel',
  components: {
    Sidebar,
    ChangeProductWindow
  },
  computed: {
    isChangeWindowOpened: function () {
      return this.$store.state.IsChangeWindowOpened;
    }
  },
  methods: {
    SignOut () {
      this.$store.commit('updateKey',null);
      CookieManager.deleteCookie('key');
      this.$router.go('/login');
    }
  },
  beforeCreate () {
    if(!this.$store.state.key){
      this.$router.go('/login');
      console.log("Key NOT exists");
      return;
    }
    console.log("Key exists");

    AXIOS.get('/admin/getcategories',{})
    .then( (result)=>{
      this.$store.commit('updateCategories',result.data);
    })
    .catch( (error)=>{
      console.log("Errors with GET categories");
    });

    AXIOS.post('/admin/getcatalog',{
      category: 'all'
    })
    .then( (result)=>{
      console.log(result.data);
      this.$store.commit('updateProducts',result.data);
    })
    .catch( (error)=>{
      console.log("Errors with POST products");
    })

    AXIOS.post('/admin/getformdata', {
      done: true,
      opened:true,
      canceled: true,
      dateset: 'all',
      page: 1
    })
    .then( (result)=>{
      // Обновить массив с данными
      // Обновить количество страниц
      this.$store.commit('updateFormsContent', result.data.items);
      this.$store.commit('updateFormsPagesCount', result.data.pages);

    })
    .catch( (error)=>{

    })
  }
}
</script>

<style scoped>
.Panel{
  width: 100%;
  height: 100%;
  background: #eee;
  justify-content: flex-start;
}
.SignOut{
  padding: 15px 40px;
  padding-left: 30px;
  position: absolute;
  top: 0;
  left: 0;
  background: rgb(9, 160, 140);
  color: #eee;
  border-bottom-right-radius: 30px;
  cursor: pointer;
  transition: all 200ms ease-in-out 0s;
  z-index: 100;
}
.SignOut i{
  font-size: 30px;
  display: block;
  color: #eee;
}
.SignOut:hover{
  transform: scale(1.1);
}
</style>


