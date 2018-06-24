<template>
  <div class="container Forms">

    <div class="container ContentPart">
      <div class="container Filters">
        <button class="StatusChangers__changer Filters__button" v-bind:class="{'Filters__button-activated': isOpenedBtn}" @click="FilterBtnClick('opened')">Открытые</button>
        <button class="StatusChangers__changer Filters__button" v-bind:class="{'Filters__button-activated': isDoneBtn}" @click="FilterBtnClick('done')">Завершенные</button>
        <button class="StatusChangers__changer Filters__button" v-bind:class="{'Filters__button-activated': isCanceledBtn}" @click="FilterBtnClick('canceled')">Отмененные</button>
      </div>
      <div class="container MainPart">
        <h1 v-if="items.length===0">Данных нет :(</h1>

        <div class="FormDataBlock" :key="item._id" v-for="(item, index) in items">
          <div class="strip" v-bind:class="{'strip-red' : item.status==='canceled', 'strip-yellow' : item.status==='opened'}"></div>
          <h3 class="FormDataBlock__element FormDataBlock__name">{{item.name}}</h3>
          <p class="FormDataBlock__element FormDataBlock__phone"><i class="fas fa-phone-square element__icon"></i> {{item.phone}}</p>
          <p class="FormDataBlock__element FormDataBlock__email"><i class="fas fa-at element__icon"></i> {{item.email}}</p>
          <p class="FormDataBlock__element FormDataBlock__date"><i class="far fa-calendar-alt element__icon"></i> {{new Date(item.openedDate).toLocaleDateString('ru')}}</p>
          <p class="FormDataBlock__element FormDataBlock__message">{{item.message}}</p>
          <div class="container FormDataBlock__element StatusChangers">
            <button class="StatusChangers__changer" v-bind:class="{StatusChangers__changerCurrent : item.status==='opened'}" @click="StatusChengerClick(item._id, index,'opened')">Открыт</button>
            <button class="StatusChangers__changer" v-bind:class="{StatusChangers__changerCurrent : item.status==='done'}" @click="StatusChengerClick(item._id, index,'done')">Завершен</button>
            <button class="StatusChangers__changer" v-bind:class="{StatusChangers__changerCurrent : item.status==='canceled'}" @click="StatusChengerClick(item._id, index,'canceled')">Отменен</button>
          </div>
        </div>
      </div>

      <div class="container PagesPart">
        <div class="container Page" v-bind:class="{'Page-current': page===currentPage}" :key="page" v-for="page in pages" @click="PageClick(page)">
          {{page}}
        </div>
      </div>
    </div>

    <ul class="container Sidebar TimeFilters">
      <li class="Sidebar__li"><button class="Sidebar__button" @click="DateSetChangeClick('today')">Сегодня</button></li>
      <li class="Sidebar__li"><button class="Sidebar__button" @click="DateSetChangeClick('yesterday')">Вчера</button></li>
      <li class="Sidebar__li"><button class="Sidebar__button" @click="DateSetChangeClick('week')">На этой неделе</button></li>
      <li class="Sidebar__li"><button class="Sidebar__button" @click="DateSetChangeClick('month')">В этом месяце</button></li>
      <li class="Sidebar__li"><button class="Sidebar__button" @click="DateSetChangeClick('all')">За все время</button></li>
    </ul>

  </div>
</template>

<script>
import AXIOS from '../axios-common';

export default {
  name: 'forms',
  computed: {
    isOpenedBtn: function () {
      return this.$store.state.IsFormsOpenedBtn;
    },
    isDoneBtn: function () {
      return this.$store.state.IsFormsDoneBtn;
    },
    isCanceledBtn: function () {
      return this.$store.state.IsFormsCanceledBtn;
    },
    currentPage: function () {
      return this.$store.state.FormsCurrentPage;
    },
    items: function () {
      return this.$store.state.FormsContent;
    },
    pages: function () {
      return this.$store.state.FormsPagesCount;
    },
    dateset: function () {
      return this.$store.state.FormsDateSet;
    }
  },
  methods: {
    GetFormData () {
      AXIOS.post('/admin/getformdata',{
        done: this.isDoneBtn,
        opened: this.isOpenedBtn,
        canceled: this.isCanceledBtn,
        page: this.currentPage,
        dateset: this.dateset
      })
      .then( (results)=>{
        // if(this.currentPage === 0 && results.data.pages>this.currentPage){
        //   console.log("PROC1");
        //   this.$store.commit('updateFormsCurrentPage', 1);
        //   this.GetFormData();
        //   return;
        // }else if(this.currentPage > results.data.pages){
        //   console.log("PROC2");
        //   this.$store.commit('updateFormsCurrentPage', results.data.pages);
        //   this.GetFormData();
        //   return;
        // }
        this.$store.commit('updateFormsPagesCount', results.data.pages);
        this.$store.commit('updateFormsContent', results.data.items);
      })
      .catch( (error)=>{
        console.log(error);
        alert('Error!');
      });
    },
    FilterBtnClick (button) {
      this.$store.commit('updateFormsFiltersBtn', button);
      this.GetFormData();
    },
    StatusChengerClick (_id, index,status) {
      AXIOS.post('/admin/setformdata',{
        _id,
        status
      })
      .then( (results)=>{
        let itemsCopy = [...this.items];
        itemsCopy[index].status = status;
        this.$store.commit('updateFormsContent', itemsCopy);
      })
      .catch( (error)=>{
        alert('Error!');
      });
    },
    DateSetChangeClick (dateset) {
      this.$store.commit('updateFormsDateSet', dateset);
      this.GetFormData();
    },
    PageClick (page) {
      this.$store.commit('updateFormsCurrentPage', page);
      this.GetFormData();
    }
  }
}
</script>

<style scoped>
.Forms{
  width: 82%;
  height: 100%;
}
.ContentPart{
  width: 80%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.Filters{
  width: 100%;
  height: 8%;
  justify-content: space-around;
}
.TimeFilters{
  width: 20%;
}
.strip{
  width: 30px;
  height: 120px;
  position: absolute;
  left: 0;
  top: -55px;
  background: rgb(60, 179, 60);
  transform: rotate(45deg);
}
.strip-red{
  background: rgb(241, 57, 57);
}
.strip-yellow{
  background: rgb(221, 199, 2);
}


.MainPart{
  width: 100%;
  height: 84%;
  padding: 20px 0;
  /* background: red; */
  overflow-y: scroll;
  flex-wrap: wrap;
}
.FormDataBlock{
  overflow: hidden;
  position: relative;
  width: 90%;
  min-height: 100px;
  background: rgb(226, 226, 226);
  padding: 20px 20px;
  padding-left: 40px;
  margin: 20px;
  cursor: default;
}
.FormDataBlock:hover .StatusChangers{
  max-height: 50px;
  padding: 25px 0;
}
.FormDataBlock__element{
  font-size: 19px;
  display: block;
  text-align: left;
  margin: 10px 0;
}
.element__icon{
  font-size: 30px;
  color: rgb(13, 146, 139);
  margin: 0 10px;
}
.FormDataBlock__name{
  font-style: italic;
  font-size: 28px;
  text-decoration: underline;
  color: rgb(13, 146, 139);
  margin-bottom: 20px;
}
.FormDataBlock__message{
  margin: 20px 0;
  font-style: italic;
}
.StatusChangers{
  display: flex;
  /* padding: 25px 0; */
  max-height: 0;
  padding: 0;
  overflow: hidden;
  transition: all 200ms linear 0s;
}
.Filters__button,
.StatusChangers__changer{
  width: 200px;
  display: block;
  margin: 0 20px;
  font-size: 20px;
  padding: 9px 20px;
  background: rgb(180, 180, 180);
  color: rgb(63, 63, 63);
  box-shadow: 7px 7px 2px rgb(160, 160, 160);
}
.StatusChangers__changer:active{
  box-shadow: 3px 3px 2px rgb(160, 160, 160);
}
.Filters__button-activated,
.StatusChangers__changerCurrent{
  background: rgb(29, 184, 184);
  box-shadow: 7px 7px 2px rgb(0, 99, 99);
  color: #eee;
}
.StatusChangers__changerCurrent:active{
  box-shadow: 3px 3px 2px rgb(0, 99, 99);
}


.PagesPart{
  width: 90%;
  height: 8%;
  /* background: blue; */
  flex-direction: column;
  flex-wrap: wrap;
  overflow-x: scroll;
  /* padding: 0 50px; */
  margin: auto;
}
.Page{
  font-size: 20px;
  /* background:  rgb(29, 184, 184);*/
  background: rgb(214, 214, 214);
  margin: 0 10px;
  color: #333;
  min-height: 35px;
  min-width: 35px;
  cursor: pointer;
  border-radius: 2px;
}
.Page:first-child{
  margin-left: 0;
}
.Page:last-child{
  margin-right: 0;
}
.Page:hover{
  background: rgb(26, 153, 153);
  color: #eee;
}
.Page-current{
  background: rgb(29, 184, 184);
  color: #eee;
}
</style>

