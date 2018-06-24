import React, { Component } from "react";
import "./Sidebar.css";

import { Link } from "react-router-dom";

class Sidebar extends Component{
  render(){
    return(
          <div className="col-md-2 Sidebar">

            <ul className="Sidebar__catContainer">
              <li className="catContainer__li"><Link className="catContainer__button" to="/panel/catalog">Каталог</Link></li>
              <li className="catContainer__li"><Link className="catContainer__button" to="/panel/categories">Категории</Link></li>
              <li className="catContainer__li"><Link className="catContainer__button" to="/panel/formdata">Данные форм</Link></li>
            </ul>

          </div>
    );
  }
}

export default Sidebar;