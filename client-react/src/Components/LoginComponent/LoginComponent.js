import React, { Component } from "react";
import "./LoginComponent.css";

import axios from "axios";
import {Redirect} from 'react-router-dom'

class LoginComponent extends Component{
  state = {
    redirect: null
  }

  LoginButtonClickHandler = () => {
    let login = this.Login.value;
    let password = this.Password.value;

    if(login==="" && password===""){
      alert("Введите логин и пароль");
      return;
    } else if (login === ""){
      alert("Введите логин");
      return;
    } else if (password === ""){
      alert("Введите пароль");
      return;
    }else {

      this.LoginComponentContainer.style.opacity=0;
      axios.post('http://localhost:8080/admin/login',{
        password: password,
        login: login
      }).then( (result)=>{
        if(result.data==="OK"){
          this.setState({
            redirect: <Redirect to="/panel" />
          });
        }
        
      }).catch( (error)=>{
        // [DEBUG] Исправить!
        this.setState({
          redirect: <Redirect to="/panel" />
        });

        // this.LoginComponentContainer.style.opacity = 1;
        // alert("Что то пошло не так: "+error);
      });
    }
    

  }
  render(){
    return(
      <div className="LoginComponent">
        {this.state.redirect}
        <div className="LoginComponent__container" ref={input => this.LoginComponentContainer = input}>
          <input type="text" placeholder="Логин" className="container__loginField" ref={input => this.Login = input}/>
          <input type="password" placeholder="Пароль" className="container__passwordField" ref={input => this.Password = input}/>
          <button className="container__loginButton" onClick={this.LoginButtonClickHandler}>Войти</button>
        </div>
      </div>
    );
  }
}

export default LoginComponent;