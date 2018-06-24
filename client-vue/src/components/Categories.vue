<template>
  <div class="container CategoriesComponent">
    <div class="container ContentPart">
      <div class="ContentPart__form">
        <h1 class="form__element">{{selectedCategoryIndex!==null ? categories[selectedCategoryIndex].name : 'Новая категория'}}</h1>
        <input type="text" class="form__element form__textbox" placeholder="Название" v-model="filledName">
        <input type="text" class="form__element form__textbox" placeholder="Ссылка" v-model="filledLink">
        <textarea cols="30" rows="10" class="form__element form__textbox form__textarea" placeholder="Описание" v-model="filledDescription"></textarea>
        <button v-if="selectedCategoryIndex!==null" class="form__element form__button form__button-delete" @click="OnDeleteButtonClick">Удалить</button>
        <button class="form__element form__button" @click="OnSaveButonClick">Сохранить</button>
      </div>
    </div>
    <ul class="container Sidebar Categories">
      <li class="Sidebar__li"><button class="Sidebar__button Sidebar__icon" @click="OnCategorySelection(null)"><i class="far fa-plus-square"></i></button></li>
      <li class="Sidebar__li" :key="category._id" v-for="(category, index) in categories"><button class="Sidebar__button" @click="OnCategorySelection(index)">{{category.name}}</button></li>
    </ul>
  </div>
</template>

<script>
import Sidebar from './Subcomponents/Sidebar';
import AXIOS from '../axios-common';

export default {
  name:'categories',
  data () {
    return {
      selectedCategoryIndex: null,
      filledName: null,
      filledLink: null,
      filledDescription: null,
      filledId: null
    }
  },
  components: {
    Sidebar
  },
  methods: {
    OnCategorySelection (index) {
      if(index!==null){
        this.selectedCategoryIndex = index;
        this.filledName = this.categories[index].name;
        this.filledLink = this.categories[index].link;
        this.filledDescription = this.categories[index].description;
        this.filledId = this.categories[index]._id;
      }else{
        this.selectedCategoryIndex = null;
        this.filledName = null;
        this.filledLink = null;
        this.filledDescription = null;
        this.filledId = null;
      }
      
    },
    OnSaveButonClick () {
      let requestString = '/admin/setcategory';
      if(this.selectedCategoryIndex===null){
        requestString = '/admin/newcategory';
      }

      // HERE SOME PROBLEMS
      AXIOS.post(requestString,{
          name: this.filledName,
          link: this.filledLink,
          description: this.filledDescription,
          _id: this.filledId
        })
        .then( (result)=>{
          console.log(result);
          this.$store.commit('updateCategories',result.data);

          this.selectedCategoryIndex = result.data.length-1;
          this.filledName = result.data[this.selectedCategoryIndex].name;
          this.filledLink = result.data[this.selectedCategoryIndex].link;
          this.filledDescription = result.data[this.selectedCategoryIndex].description;
          this.filledId = result.data[this.selectedCategoryIndex]._id;
        })
        .catch( (error)=>{
          console.log('Error with POST to '+requestString);
          console.log(error);
        })
    },
    OnDeleteButtonClick () {
      AXIOS.post('/admin/delcategory',{
        _id: this.filledId
      })
      .then( (result)=>{
        console.log(result);
        this.$store.commit('updateCategories',result.data);

        this.selectedCategoryIndex = null;
        this.filledName = null;
        this.filledLink = null;
        this.filledDescription = null;
        this.filledId = null;
      })
      .catch( (error)=>{
        console.log('Error with POST from delete category ');
      });
    }
  },
  
  computed: {
    categories: function () {
      return this.$store.state.Categories;
    }
  },
  beforeCreate () {
    if(!this.$store.state.key){
      this.$router.go('/login');
      console.log("Key NOT exists");
      return;
    }
    console.log("Key exists");
  }
}
</script>

<style scoped>
.CategoriesComponent{
  width: 82%;
  height: 100%;
}
.ContentPart{
  width: 80%;
  height: 100%;
  flex-wrap: wrap;
}
.Categories{
  width: 20%;
  height: 100%;
}
.ContentPart__form{
  width: 650px;
  min-height: 500px;
  border-radius: 2px;
  background: rgb(228, 228, 228);
  padding: 30px;
}
.form__element{
  margin: 10px 0;
}
.form__textbox{
  font-size: 20px;
  width: 90%;
  padding: 5px 10px;
}
.form__textbox:focus{
  outline-color: teal;
}
.form__textarea{
  text-align: left;
  padding: 10px;
  resize: none;
}
.form__textarea::placeholder{
  text-align: center;
}
.Sidebar__icon{
  font-size: 30px;
  color: teal;
}
.form__button{
  width: 40%;
  font-size: 20px;
  padding: 8px 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.form__button-delete{
  background: rgb(233, 71, 71);
  box-shadow: 7px 7px 2px rgb(163, 52, 52);
}
.form__button-delete:active{
  box-shadow: 3px 3px 2px rgb(163, 52, 52);
}
</style>
