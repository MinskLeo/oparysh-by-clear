import Vue from 'vue'
import Vuex from 'vuex'

import CookieManager from "./cookieManager";
import { rejects } from 'assert';
import AXIOS from './axios-common';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    key: null,
    methods: {
      CheckKey: function (axios, key) {
      return new Promise((resolve, reject) => {
        axios.post('/admin/checkpas', {
            key: key
          })
          .then((result) => {
            resolve(true);
            return;
          })
          .catch((error) => {
            reject(false);
            return;
          })
        });

      }
    },

    Messages: [
      {
        title: 'Ошибка: неверный ключ',
        description: 'Введен неверный ключ'
      }
    ],

    Categories: null,
    Products: null,
    IsChangeWindowOpened: false,
    ChangeWindowType: 'edit',
    ChangeWindowProduct: null,

    IsFormsOpenedBtn: true,
    IsFormsDoneBtn: true,
    IsFormsCanceledBtn: true,
    FormsCurrentPage: 1,
    FormsPagesCount: null,
    FormsContent: null,
    FormsDateSet: 'all'
  },
  mutations: {
    updateKey (state, key) {
      state.key = key;
      CookieManager.setCookie('key',key);
    },
    updateCategories (state, categories) {
      state.Categories = categories;
    },
    updateProducts (state, products) {
      state.Products = products;
    },
    updateIsChangeWindowOpened (state, isOpened) {
      state.IsChangeWindowOpened = isOpened;
    },
    pushToMessages(state, message) {
      state.Messages.push(message);
      setTimeout(() => {
        state.Messages.pop();
      }, 5000);
    },
    updateChangeWindowType (state, type) {
      state.ChangeWindowType = type;
    },
    updateChangeWindowProduct (state, product) {
      state.ChangeWindowProduct = product;
    },
    updateFormsFiltersBtn (state, button) {
      if (button==='opened'){
        state.IsFormsOpenedBtn = !state.IsFormsOpenedBtn;
      } else if (button==='done'){
        state.IsFormsDoneBtn = !state.IsFormsDoneBtn;
      }else{
        state.IsFormsCanceledBtn = !state.IsFormsCanceledBtn;
      }
    },
    updateFormsPagesCount (state, count) {
      state.FormsPagesCount = count;
    },
    updateFormsContent (state, content) {
      state.FormsContent = content;
    },
    updateFormsCurrentPage (state, page) {
      state.FormsCurrentPage = page;
    },
    updateFormsDateSet (state, dateset) {
      state.FormsDateSet = dateset;
    }
  }
  
  
})
