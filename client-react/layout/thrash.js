<div className="row Catalog">
  {changeDataWindowRendered}

  <div className="col-md-2">

  </div>

  <div className="col-md-8">
    {/* CONTENTPART */}

    <div className="contentPart Catalog__contentPart">
      {itemsRendered}
    </div>

    {/* CONTENTPART END */}

  </div>

  <div className="col-md-2">

    <div className="Catalog__categoriesSideBar">
      <ul className="categoriesSideBar__list">
        <li className="list__item"><button className="item__button-catalog" onClick={this.OnCategoryClick.bind(this, "all")}>Весь каталог</button></li>
        {categoriesRendered}

      </ul>

    </div>



  </div>

  {/* END */}

</div>