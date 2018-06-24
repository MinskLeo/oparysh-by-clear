import React, { Component } from "react";
import "./Panel.css";

import { Link } from 'react-router-dom'

class Panel extends Component{
  componentDidMount = () => {
    document.title = "Панель администрирования";
  }

  render(){
    return(
      <div className="Panel">
        <div className="contentPart Panel__contentPart">

          <Link className="contentPart__block" to="/panel/catalog">
            <h2 className="block__title">Каталог</h2>
            <p className="block__description">Добавление, изменение, удаление товара</p>
          </Link>

          <Link className="contentPart__block" to="/panel/categories">
            <h2 className="block__title">Категории</h2>
            <p className="block__description">Добавление, изменение, удаление категорий товара</p>
          </Link>

          <Link className="contentPart__block" to="/panel/formdata">
            <h2 className="block__title">Данные форм</h2>
            <p className="block__description">Контроль данных форм, изменение статуса, удаление заказа</p>
          </Link>

        </div>
      </div>
    );
  }
}

export default Panel;