import React, { Component } from "react";
import "./Categories.css";

import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";

class Categories extends Component{
  state = {
    categories: null,
    selectedCategory: {
      name: "Новая категория",
      link: "",
      description: ""
    },
    selectedIndex: null,
    nextNew: true
  }
  OnNameInput = (event) => {
    this.setState({
      selectedCategory: {
        ...this.state.selectedCategory,
        name: event.target.value
      }
    });
  }
  OnLinkInput = (event) => {
    this.setState({
      selectedCategory: {
        ...this.state.selectedCategory,
        link: event.target.value
      }
    });
  }
  OnDescriptionInput = (event) => {
    this.setState({
      selectedCategory: {
        ...this.state.selectedCategory,
        description: event.target.value
      }
    });
  }

  componentWillMount = () => {
    // Title
    document.title = "Категории";

    // Categories
    axios.get('http://localhost:8080/admin/getcategories', {}).then((result) => {
      this.setState({
        categories: result.data
      });
      console.log(result.data);
    }).catch((error) => {
      alert('Error!');
    });
  }

  OnCategoryClick = (index, e) => {
    console.log(this.state.categories);
    this.setState({
      selectedCategory: this.state.categories[index],
      nextNew: false,
      selectedIndex: index
    });
  }
  OnAddNewClick = () => {
    this.setState({
      nextNew: true,
      selectedCategory: {
        name: "Новая категория",
        link: "",
        description:""
      }
    });
  }

  OnSaveClick = (e) => {
    console.log("70: Started!");
    let requestString = null;
    let requestObj = null;

    if(this.state.nextNew){
      console.log("75: New");
      // Новая категория
      if(this.state.selectedCategory.name!=="" &&
        this.state.selectedCategory.link!=="" &&
        this.state.selectedCategory.description!==""){
          console.log("80: ValidatedNew!");

          requestString = "http://localhost:8080/admin/newcategory";
          requestObj = {
            name: this.state.selectedCategory.name,
            link: this.state.selectedCategory.link,
            description: this.state.selectedCategory.description
          };
          console.log(requestString);
          console.log(requestObj);
        }
      
    }else{
      console.log("93: SetValidated!");
      requestString = "http://localhost:8080/admin/setcategory";
      requestObj = {
        id: this.state.selectedCategory["_id"],
        name: this.state.selectedCategory.name,
        link: this.state.selectedCategory.link,
        description: this.state.selectedCategory.description
      };
      console.log(requestString);
      console.log(requestObj);
    }

    axios.post(requestString, requestObj).then( (result) => {
      console.log(result.data);
      if(result.data.success === true){
        this.setState({
          categories: result.data.categories,
          selectedCategory: {
            name: "Новая категория",
            link: "",
            description: ""
          },
          selectedIndex: null,
          nextNew: true
        });
        console.log("Success! (saving)");
      }
    }).catch( (error) => {
      console.log("Error! (saving)");
    });
  }

  OnDeleteClick = (e) => {
    console.log(this.state.selectedCategory);
    axios.post('http://localhost:8080/admin/delcategory', { id: this.state.categories[this.state.selectedIndex]["_id"] }).then((result) => {
      // {
      //    success: true | false,
      //    categories: []
      // }

      if (result.data.success === true) {
        this.setState({
          categories: result.data.categories,
          selectedCategory: {
            name: "Новая категория",
            link: "",
            description: ""
          },
          selectedIndex: null,
          nextNew: true
        });
      } else {
        alert("Errors with deleting...(in response)");
      }
    }).catch((error) => {
      alert("Errors with deleting...(catch)");
    });

  }

  render(){
    let renderedCategories = null;

    if(this.state.categories){
      renderedCategories = this.state.categories.map( (item,index)=>{
        return (
          <li className="categoriesList__item" key={item.link}>
            <button className="item__button" onClick={this.OnCategoryClick.bind(this,index)}>{item.name}</button>
          </li>
        );
      }); 
    }

    // if(this.state.nextNew){
    //   categoryName = "Новая категория";
    //   categoryLink = "";
    //   categoryDescription = "";
    // }else{
    //   categoryName = this.state.selectedCategory.name;
    //   categoryLink = this.state.selectedCategory.link;
    //   categoryDescription = this.state.selectedCategory.description;
    // }

    return(
      <div className="row wrap">
        <Sidebar></Sidebar>

        <div className="col-md-10">
          <div className="container">
            <div className="row">

              <div className="col-md-4"></div>

              {/* CENTER */}
              <div className="col-md-4 column categoriesColumn">
                <div className="addNewCatBlock">
                  <i class="far fa-plus-square" onClick={this.OnAddNewClick}></i>
                </div>
                <ul className="categoriesList">

                  {renderedCategories}
                  
                </ul>
              </div>

              {/* Change Window */}
              <div className="col-md-4 column">
                <div className="categoriesChange">

                  <p className="categoryLogo" style={this.state.nextNew ? { color: "rgb(8, 160, 160)" } : { color: "#333" } }>
                    {this.state.selectedCategory.name}
                  </p>

                  <label htmlFor="name" className="categoriesChange__label">Название</label>
                  <input type="text" placeholder="Название" id="name" className="categoriesChange__textinput" value={this.state.selectedCategory.name} onInput={this.OnNameInput}/>
                  <label htmlFor="link" className="categoriesChange__label">Ссылка (англ. без пробелов и спец. симв.)</label>
                  <input type="text" placeholder="Ссылка" id="link" className="categoriesChange__textinput" value={this.state.selectedCategory.link} onInput={this.OnLinkInput}/>
                  <label htmlFor="description" className="categoriesChange__label">Краткое описание</label>
                  <textarea id="description" cols="30" rows="10" placeholder="Описание" className="categoriesChange__textinput" value={this.state.selectedCategory.description} onInput={this.OnDescriptionInput}></textarea>
                  <button className="categoriesChange__button delbtn" style={this.state.nextNew ? { display: "none" } : { display: "block" } } onClick={this.OnDeleteClick}>Удалить</button>
                  <button className="categoriesChange__button" onClick={this.OnSaveClick}>Сохранить</button>
                  
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    );
  }
}

export default Categories;