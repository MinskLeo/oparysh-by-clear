<template>
  <div class="container ChangeProductWindow">
    <div class="container ChangeProductWindow__form">
      <div class="closeForm">
        <i class="fas fa-times" @click="CloseWindow"></i>
      </div>
      <div class="form__column">
        <label class="form__element form__label">
        Название:
        <input class="form__element form__textbox" type="text" placeholder="Название товара" v-model="productName">
        </label>
        <div class="form__element form__select">
          <button class="select__button select__opener" @click="OnOpenerClick">{{selectedName}}</button>
          <ul class="select__items" v-show="selectOpened">
            <li class="items__li" :key="category._id" v-for="(category, index) in categories"><button class="select__button items__button" @click="OnCategoryClick(index)">{{category.name}}</button></li>
          </ul>
        </div>
        <label class="form__element form__label">
          Цена:
          <input type="text" class="form__element form__textbox form__textbox-short" placeholder="Цена" v-model="productPrice">
        </label>
        <label class="form__element form__label">
          Описание:
          <textarea class="form__element form__textbox form__textarea" cols="30" rows="10" placeholder="Описание" v-model="productDescription"></textarea>
        </label>
      </div>
      <div class="container form__column">
        <div class="form__element form__imageContainer" v-if="changeWindowType==='edit'">
          <img v-bind:src="product.image" alt="#">
        </div>
        <label class="form__element form__label form__inputFile button">
          Выбрать файл
          <input type="file" @change="OnFileChange" hidden>
        </label>
        <p class="form__element form__inputFileSelected">{{selectedFile ? selectedFile.name : 'Файл не выбран'}}</p>
      </div>
      <div class="container form__row">
        <button class="form__element form__button form__button-red" v-if="changeWindowType==='edit'" @click="OnDeleteButtonClick">Удалить</button>
        <button class="form__element form__button" @click="OnSaveButtonClick">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
import AXIOS from "../axios-common";

export default {
  name: 'change-product-window',
  data () {
    return {
      selectOpened: false,
      selectedName: 'Категория',
      selectedIndex: null,
      selectedLink: null,
      selectedFile: null,
      productName: null,
      productDescription: null,
      productPrice: null,
      productId: null
    }
  },
  computed: {
    categories: function () {
      return this.$store.state.Categories;
    },
    product: function () {
      return this.$store.state.ChangeWindowProduct;
    },
    changeWindowType: function () {
      return this.$store.state.ChangeWindowType;
    }
  },
  methods: {
   CloseWindow () {
     this.$store.commit('updateChangeWindowProduct', null);
     this.$store.commit('updateIsChangeWindowOpened', false);
   },
   OnCategoryClick (index) {
     this.selectedIndex = index;
     this.selectedName = this.categories[index].name;
     this.selectedLink = this.categories[index].link;
     this.selectOpened = false;
   },
   OnOpenerClick () {
     this.selectOpened = !this.selectOpened;
   },
   OnFileChange (e) {
     this.selectedFile = e.target.files[0];
   },
   OnSaveButtonClick () {
     let formData = new FormData();
     formData.append('_id',this.productId);
     formData.append('name',this.productName);
     formData.append('price',this.productPrice);
     formData.append('description',this.productDescription);
     formData.append('category',this.categories[this.selectedIndex].link);
     if(this.selectedFile){
       formData.append('file',this.selectedFile);
     }

     const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    
    let requestString = '/admin/setproduct';
    if(this.$store.state.ChangeWindowType==='new'){
      requestString = '/admin/newproduct';
    }

    AXIOS.post(requestString, formData, config)
    .then( (result)=>{
      if(result){
        // Commit here new array to store
        this.$store.commit('updateProducts', result.data);
        this.CloseWindow();
      }else{
        console.log("Error with POST to "+requestString);
      }
    })
    .catch( (error)=>{
      console.log("Error with POST to "+requestString);
    });
     
   },
   OnDeleteButtonClick () {
    AXIOS.post('/admin/deleteproduct', {
      _id: this.productId
    })
    .then( (result) => {
      if(result){
        this.$store.commit('updateProducts', result.data);
        this.CloseWindow();
      }else{
        console.log("Error with POST to DELETE product");
      }
    })
    .catch( (error) => {
      console.log("Error with POST to DELETE product");
    });
   }
  },
  created () {
    
    if(this.product){
      console.log("Proc1");
      this.productName = this.product.name;
      this.productPrice = this.product.price;
      this.productDescription = this.product.description;
      this.productId = this.product._id;

      if(this.categories){
        console.log("Proc2");
        console.log("PRODUCT:");
        console.log(this.product);
        console.log("CATEGORIES:");
        console.log(this.categories);
        this.categories.forEach( (category,index)=>{
          if(category.link===this.product.category){
            this.selectedName = this.categories[index].name;
            this.selectedLink = this.categories[index].link;
            this.selectedIndex = index;
          }
        })
        
      }
    }else{
      this.selectedName = this.categories[0].name;
      this.selectedLink = this.categories[0].link;
      this.selectedIndex = 0;
    }
    
  }
}
</script>

<style scoped>
.ChangeProductWindow{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 128, 128, 0.342);
  z-index: 90;
}
.ChangeProductWindow__form{
  position: relative;
  width: 750px;
  min-height: 400px;
  background: rgb(221, 221, 221);
  box-shadow: 0 0 2px rgb(172, 172, 172);
  padding: 20px;
  padding-top: 50px;
  border-radius: 2px;
  flex-wrap: wrap;
  /* align-items: flex-start; */
  /* justify-content: flex-start; */
}
.form__column{
  width: 50%;
  /* margin: 0 10px; */
  padding: 0 10px;
  flex-direction: column;
}
.form__row{
  width: 100%;
}
.closeForm{
  position: absolute;
  right: 15px;
  top: 15px;
}
.closeForm i{
  font-size: 35px;
  cursor: pointer;
}
.closeForm:hover i{
  color: red;
}


.form__element{
  margin: 10px 0;
}
.form__textbox{
  display: block;
  width: 300px;
  font-size: 18px;
  padding: 5px 20px;
}
.form__textbox-short{
  width: 200px;
}
.form__textbox:focus{
  outline-color: teal;
}

.form__select{
  min-width: 200px;
  max-width: 300px;
}
.select__button{
  width: 100%;
  font-size: 17px;
  box-shadow: none;
  padding: 10px 15px;
  color: rgb(224, 224, 224);
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* As second variant */
.select__button:active{
  top: 0;
  left: 6px;
}
.select__opener{
  background: rgb(7, 163, 163);
}
.select__opener:hover{
  background: rgb(9, 145, 145);
}
.select__items{
  list-style: none;
}
.items__li{
  width: 100%;
}
.items__button{

}
.items__button:hover{
  background: rgb(27, 173, 173)
}
.form__label{
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  font-size: 18px;
}
.form__textarea{
  width: 300px;
  resize: none;
  text-align: left;
}
.form__imageContainer{
  max-width: 100%;
  max-height: 100%;
}
.form__imageContainer img{
  max-width: 100%;
  max-height: 100%;
  border: 3px solid rgb(151, 150, 150);
}
.form__inputFile{
  /* background: red; */
  padding: 15px 25px;
}
.form__inputFileSelected{
  font-style: italic;
}
.form__button{
  font-size: 20px;
  margin: 0 10px;
  padding: 8px 10px;
  width: 200px;
}
.form__button-red{
  background: rgb(233, 71, 71);
  box-shadow: 7px 7px 2px rgb(163, 52, 52);
}
.form__button-red:active{
  box-shadow: 3px 3px 2px rgb(163, 52, 52);
}
</style>
