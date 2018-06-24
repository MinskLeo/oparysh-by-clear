import React, { Component } from "react";
import "./NewProductWindow.css";

import axios from "axios";

class ChangeDataWindow extends Component{
  state = {
    selectedImage: null,
    selectedCategory: null,
    dropDownOpened: false,
    linkCategory: null
  }

  componentWillMount = () => {
    this.setState({
      categories: this.props.categories,
      selectedCategory: this.props.categories[0].name,
      linkCategory: this.props.categories[0].link
    });
  }

  FileSelectionChanged = () => {
    let splitted = this.FileField.value.split('\\');
    this.PhotoValue.innerText = splitted[splitted.length - 1];
    this.setState({
      selectedImage: this.FileField.value
    })
  }

  OnDropDownOpenerClick = () => {
    if(this.state.dropDownOpened){
      
      this.dropDownSelect.style.maxHeight = "0px";
    }else{
      this.dropDownSelect.style.maxHeight = "700px";
    }
    this.setState({
      dropDownOpened: !this.state.dropDownOpened
    });
  }

  CategoryOptionClick = (category, e) => {
    this.setState({
      selectedCategory: category.name,
      dropDownOpened: false,
      linkCategory: category.link
    });
    this.dropDownSelect.style.maxHeight="0px";
  }

  SaveButtonClick = () => {
    const formData = new FormData();
    formData.append('file', this.FileField.files[0]);
    formData.append('name', this.NameField.value);
    formData.append('price', this.PriceField.value);
    formData.append('category', this.state.linkCategory);
    formData.append('description', this.DescrtiptionField.value);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    axios.post('http://localhost:8080/admin/newproduct', formData, config).then( (result) => {
      if(result.data.success){
        this.props.closeMethod();
      }
    }).catch( (error) => {
      alert("Error!");
    });
  }

  

  render(){
    let categoriesSelectRendered = null;
    if(this.state.categories){
      categoriesSelectRendered = this.state.categories.map( (item,index)=>{
        return (
          <li key={item["_id"]} className="options__option"><button className="option__button" onClick={this.CategoryOptionClick.bind(this,item)}>{item.name}</button></li>
        );
      });
    }
    // name
    // description
    // price
    // image
    // category
    return(
      <div className="ChangeDataWindow">
        

        <div className="container">
          <div className="row form">

            <div className="closeChangeDataWindow">
              <i class="fas fa-times" onClick={this.props.closeMethod}></i>
            </div>

            <div className="col-md-12 ">
              <div className="row">

              <div className="col-md-12 form__container">
                <input type="text" placeholder="Название" className="form__text" defaultValue={this.state.productName} ref={input => this.NameField = input}/>
                  <input type="text" placeholder="Цена" className="form__text" defaultValue={this.state.productPrice} ref={input => this.PriceField = input}/>
                  <div className="form__select">
                    <button className="select__opener" onClick={this.OnDropDownOpenerClick}>{this.state.selectedCategory}</button>
                    <ul className="select__options" ref={input => this.dropDownSelect = input}>
                      {categoriesSelectRendered}
                    </ul>
                  </div>
                  <textarea cols="30" rows="5" className="form__text" placeholder="Описание" defaultValue={this.state.productDescription} ref={input => this.DescrtiptionField = input} style={{resize: 'none'}}></textarea>
                    <div className="row row-100 row-flex row-column">
                      <label className="form__button form__button-fileinput" htmlFor="fileInput">Выбрать файл</label>
                      <input id="fileInput" style={{display:"none"}} type="file" accept=".png, .jpg, .jpeg"  ref={input => this.FileField = input} onChange={this.FileSelectionChanged}/>
                      <div className="form__inputFileValue" ref={input=>this.PhotoValue = input}>
                        
                      </div>
                    </div>
                  <div className="row row-100 row-flex row-column">
                    <button className="form__button form__button-save form__button-save-newproduct" onClick={this.SaveButtonClick}>Сохранить</button>
                  </div>
                  
                  
              </div>
                
              </div>

            </div>

          </div>
        </div>
      
      </div>
    );
  }
}

export default ChangeDataWindow;