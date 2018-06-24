<template>
  <div class="container Panel">
    <div class="container Panel__blocksContainer">
      <router-link to="/panel/catalog" class="container block button">
        <p class="block__title">Каталог</p>
        <p class="block__description">Добавление, изменение, удаление товаров</p>
      </router-link>
      <router-link to="/panel/categories" class="container block button">
        <p class="block__title">Категории</p>
        <p class="block__description">Добавление, изменение, удаление категорий</p>
      </router-link>
      <router-link to="/panel/forms" class="container block button">
        <p class="block__title">Данные форм</p>
        <p class="block__description">Работа с данными, изменение статуса отправленных форм</p>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'mainpanel',
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
.Panel{
  width: 100%;
  height: 100%;
  background: #eee;
}
.Panel__blocksContainer{
  max-width: 1300px;
}
.block{
  font-size: 25px;
  width: 300px;
  background: rgb(226, 226, 226);
  color: #eee;
  margin: 20px;
  border-radius: 2px;
  box-shadow: 10px 10px 2px teal;
  cursor: pointer;
  transition: all 60ms ease-in 0s;
  flex-direction: column;
  padding: 20px;
}
.block:active{
  box-shadow: 6px 6px 2px teal;
}
.block:hover{
  background: rgb(216, 216, 216);
}
.block__description{
  font-size: 15px;
  margin: 10px;
  font-style: italic;
  text-decoration: underline;
}

/* @keyframes BlockShadowAnimation {
  0%{
    box-shadow: -10px 10px 2px teal;
  }
  25%{
    box-shadow: 10px 10px 2px teal;
  }
  50%{
    box-shadow: 10px -10px 2px teal;
  }
  75%{
    box-shadow: -10px -10px 2px teal;
  }
  100%{
    box-shadow: -10px 10px 2px teal;
  }
} */
</style>

