<template>
  <div class="container Catalog">
    <div class="container ContentPart">
      <div class="container ProductCard" :key="product._id" v-for="product in products">
        <div class="container ProductCard__mask">
          <i class="fas fa-pencil-alt mask__icon" @click="OnCardChangeClick(product)"></i>
          <i class="fas fa-trash-alt mask__icon" @click="OnCardDeleteClick(product)"></i>
        </div>
        <div class="container ProductCard__imageContainer">
          <!-- http://www.zoofirma.ru/images/stories/2012/05/17/ryba-sobaka2.jpg -->
          <img v-bind:src="product.image" v-bind:alt="product.name">
        </div>
        <p class="container ProductCard__name">
          {{product.name}}
        </p>
      </div>
    </div>
    <ul class="container Sidebar Categories">
      <li class="Sidebar__li"><button class="Sidebar__button Sidebar__button-icon" @click="OnNewButtonClick"><i class="far fa-plus-square"></i></button></li>
      <li class="Sidebar__li" :key="category._id" v-for="category in categories"><button class="Sidebar__button" @click="OnCategoryClick(category.link)">{{category.name}}</button></li>
    </ul>
  </div>
</template>

<script>
import AXIOS from '../axios-common';

export default {
  name: 'catalog',
  methods: {
    OnNewButtonClick () {
      this.$store.commit('updateChangeWindowType','new');
      this.$store.commit('updateIsChangeWindowOpened', true);
    },
    OnCardDeleteClick (product) {
      AXIOS.post('/admin/deleteproduct', {
      _id: product._id
    })
    .then( (result) => {
      if(result){
        this.$store.commit('updateProducts', result.data);
      }else{
        console.log("Error with POST to DELETE product");
      }
    })
    .catch( (error) => {
      console.log("Error with POST to DELETE product");
    });
    
    },
    OnCardChangeClick (product) {
      this.$store.commit('updateChangeWindowType','edit');
      this.$store.commit('updateChangeWindowProduct', product);
      this.$store.commit('updateIsChangeWindowOpened', true);
    },
    OnCategoryClick (link) {
      AXIOS.post('/admin/getcatalog',{
        category: link
      })
      .then( (results)=>{
        this.$store.commit('updateProducts', results.data);
      })
      .catch( (error)=>{
        console.log("Error with POST /admin/getcatalog");
      })
    }
  },
  computed:{
    categories: function () {
      return this.$store.state.Categories;
    },
    products: function () {
      return this.$store.state.Products;
    }
  }
}
</script>

<style scoped>
.Catalog{
  width: 82%;
  height: 100%;
}
.ContentPart{
  width: 80%;
  height: 100%;
  overflow-y: scroll;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.Categories{
  width: 20%;
  height: 100%;
}

.ProductCard{
  width: 250px;
  height: 300px;
  background: rgb(226, 226, 226);
  margin: 20px;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 2px;
  overflow: hidden;
}
.ProductCard__imageContainer{
  max-width: 100%;
  height: 80%;
}
.ProductCard__imageContainer img{
  max-width: 100%;
  height: 100%;
}
.ProductCard__name{
  width: 100%;
  height: 20%;
  font-size: 18px;
}
.ProductCard__mask{
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(51, 51, 51, 0.4);
  opacity: 0;
  transition: opacity 150ms linear 0s;
}
.ProductCard:hover .ProductCard__mask{
  opacity: 1;
}
.mask__icon{
  color: #eee;
  font-size: 30px;
  display: block;
  margin: 10px;
  cursor: pointer;
}
.mask__icon:hover{
  color: rgb(192, 192, 192);
}
.Sidebar__button-icon{
  font-size: 30px;
}
.Sidebar__button-icon:active i{
  color: teal;
}
</style>

