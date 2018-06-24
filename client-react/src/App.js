import React, { Component } from 'react';
import './App.css';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import LoginComponent from "./Components/LoginComponent/LoginComponent";

import Panel from "./Components/Panel/Panel";
import Catalog from "./Components/Catalog/Catalog";
import Categories from "./Components/Categories/Categories";
import FormData from "./Components/FormData/FormData";


// Заход в панель. Если есть cookie - чек, иначе ожидаем

class App extends Component {
  render() {
    return (
      //  basename="/admin"
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LoginComponent} />
            <Route exact path="/panel" component={Panel} />
            <Route exact path="/panel/catalog" component={Catalog} />
            <Route exact path="/panel/categories" component={Categories} />
            <Route exact path="/panel/formdata" component={FormData} />
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;