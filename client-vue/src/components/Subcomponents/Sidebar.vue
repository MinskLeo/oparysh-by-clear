<template>
  <ul class="container Sidebar">
    <li class="Sidebar__li"><router-link to="/panel/catalog" class="Sidebar__button">Каталог</router-link></li>
    <li class="Sidebar__li"><router-link to="/panel/categories" class="Sidebar__button">Категории</router-link></li>
    <li class="Sidebar__li"><router-link to="/panel/forms" class="Sidebar__button">Данные форм</router-link></li>
  </ul>
</template>

<script>
export default {
  name:'sidebar',
}
</script>

<style>
.Sidebar{
  width: 18%;
  height: 100%;
  background: rgb(231, 231, 231);
  flex-direction: column;
  list-style: none;
}
.Sidebar__li{
  width: 100%;
}
.Sidebar__button{
  width: 100%;
  font-size: 20px;
  box-shadow: none;
  background: transparent;
  color: #333;
  padding: 10px 0;
  display: block;
  text-decoration: none;
}
.Sidebar__button:hover{
  background: rgb(219, 219, 219);
  color: teal;
}
</style>

