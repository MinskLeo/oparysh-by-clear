<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
}
.button,
button{
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 2px;
  background: rgb(29, 184, 184);
  color: #eee;
  box-shadow: 7px 7px 2px rgb(0, 99, 99);
  top: 0;
  left: 0;
  position: relative;
  transition: all 30ms linear 0s;
}
.button:active,
button:active{
  box-shadow: 3px 3px 2px rgb(0, 99, 99);
  top: 4px;
  left: 4px;
}
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
}
.container{
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
