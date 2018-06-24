<template>
  <div class="container Login">
    <div class="container LoginForm">
      <input type="text" v-model="key" placeholder="Ключ" class="LoginForm__element LoginForm__textbox">
      <button class="LoginForm__element LoginForm__button" @click="LogInButtonClick">Вход</button>
    </div>
  </div>
</template>

<script>
import AXIOS from "../axios-common";
import CookieManager from "../cookieManager";

export default {
  name: 'login',
  data () {
    return {
      key: null
    }
  },
  methods: {
    async SignIn (cookieMode) {
      let key = null;
      if(cookieMode===true){
        key = await CookieManager.getCookie('key');
        console.log("CookieMode");
      }else{
        key = this.key;
      }
      if(key){
        console.log("2. Key founded!");
        console.log("3. Waiting for response...");
        await this.$store.state.methods.CheckKey(AXIOS, key)
        .then( (result)=>{
          if(result===true){
            console.log("4. Everything is fine");
            this.$store.commit('updateKey', key);
            this.$router.push('/panel')
            
          }else{
            console.log("4. Authentication error!");
          }
        })
        .catch( (error)=>{
          console.log("4. Problems with authentication");
          return;
        })
        
      }else{
        console.log("2. No Key!");
      }
    },
    LogInButtonClick () {
      this.SignIn(false);
    }
  },
  created() {
   this.SignIn(true);
  }
}
</script>


<style>
.Login{
  width: 100%;
  height: 100%;
  background: #eee;
}
.LoginForm{
  width: 400px;
  height: 300px;
  
  padding: 20px;
  flex-direction: column;
}
.LoginForm__element{
  margin: 10px 0;
  font-size: 20px;
  width: 100%;
}
.LoginForm__textbox{
  width: 100%;
  font-size: 25px;
  text-align: left;
  padding: 8px 20px;
  transition: all 500ms ease 0s; 
  outline-color: transparent;
}
.LoginForm__textbox:focus{
  outline-color: rgb(10, 182, 182);
}
.LoginForm__textbox::placeholder{
  text-align: center;
}
.LoginForm__button{
  width: 150px;
  padding: 5px;
  border-radius: 2px;
  background: rgb(29, 184, 184);
  color: #eee;
  box-shadow: 7px 7px 2px rgb(0, 99, 99);
  top: 0;
  left: 0;
  position: relative;
  transition: all 30ms linear 0s;
}
.LoginForm__button:active{
  box-shadow: 3px 3px 2px rgb(0, 99, 99);
  top: 4px;
  left: 4px;
}
</style>
