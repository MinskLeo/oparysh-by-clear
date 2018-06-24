<template>
  <div class="MessageSystem">
    <transition-group name="fade">
      <div class="Message" :key="index" v-for="(message, index) in messages">
        <p class="Message__title Message__title-warning">{{message.title}}</p>
        <p class="Message__description">{{message.description}}</p>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'message-system',
  computed: {
    messages: function () {
      return this.$store.state.Messages;
    }
  }
}
</script>

<style scoped>
.MessageSystem{
  width: 500px;
  height: 100px;
  /* background: rgba(255, 0, 0, 0.507); */
  position: absolute;
  z-index: 100;
  left: calc(50% - 200px);
  top: 0;
}
.Message{
  width: 100%;
  /* ???? */
  /* min-height: 100px; */
  margin: 10px 0;
  /* padding: 20px; */
  overflow: hidden;
  /* background: red; */
  box-shadow: 0 0 3px 1px rgb(202, 202, 202);
  background: rgba(221, 221, 221, 0.85);
  border-radius: 2px;
  transition: box-shadow 100ms ease-in-out 0s;
  cursor: default;
}
.Message:hover{
  box-shadow: 0 0 5px 5px rgb(202, 202, 202);
}
.Message__title{
  text-align: left;
  font-size: 20px;
  padding: 12px 15px;
}
.Message__title-error{
  background: rgba(214, 50, 50, 0.493);
}
.Message__title-warning{
  background: rgba(228, 162, 63, 0.726);
}
.Message__description{
  font-size: 18px;
  padding: 17px;
  text-align: left;
  font-style: italic;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
