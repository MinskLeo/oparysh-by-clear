import React, { Component } from "react";
import "./ChangeDataWindow.css";

import axios from "axios";

class ChangeDataWindow extends Component{
  state = {
    productName: null,
    productPrice: null,
    productDescription: null,
    productImage: null,
    selectedCategory: "Категория",
    linkCategory: null, 
    dropDownOpened: false
  }

  componentWillMount = () => {
    let name = null;
    this.props.categories.forEach( (item)=>{
      if (item.link == this.props.selectedCategory){
        name = item.name;
      }
    });
    

    this.setState({
      productImage: this.props.item.image,
      productDescription: this.props.item.description,
      productPrice: this.props.item.price,
      productName: this.props.item.name,
      categories: this.props.categories,
      id: this.props.item["_id"],
      selectedCategory: name,
      linkCategory: this.props.selectedCategory
    });
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
    // let objectToSend = {
    //   id: this.state.id,
    //   name: this.NameField.value,
    //   price: this.PriceField.value,
    //   category: this.state.selectedCategory,
    //   description: this.DescrtiptionField.value
    // }
    
    // axios.post('http://localhost:8080/admin/setproduct', {...objectToSend}).then( (result) => {
    //   if(result.status==="OK"){
    //     alert("OK!");
    //   }else{
    //     alert("Error! 1");
    //   }

      const formData = new FormData();
      formData.append('file', this.FileField.files[0]);
      formData.append('id', this.state.id);

      formData.append('name',this.NameField.value);
      formData.append('price',this.PriceField.value);
      formData.append('category',this.state.linkCategory);
      formData.append('description',this.DescrtiptionField.value);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }

      axios.post("http://localhost:8080/admin/setproduct", formData, config).then( (result)=>{
        if(result.data.success){
          this.CloseWindow();
        }else{
          alert("Error!");
        }
      }).catch( (error)=>{
        alert("Error!");
      });

    // }).catch( (error) => {
    //   alert("Error! 2");
    // });

    
  }

  DeleteButtonClick = () => {
    axios.post('http://localhost:8080/admin/deleteproduct', {
      id: this.state.id
    }).then( (result) => {
      if(result.data.success){
        this.CloseWindow();
      }else{
        alert("Error!");
      }
    }).catch( (error) => {
      alert("Error!");
    });
  }

  FileSelectionChanged = () => {
    let splitted = this.FileField.value.split('\\');
    this.PhotoValue.innerText = splitted[splitted.length-1];
  }

  CloseWindow = () => {
    this.props.CloseMethod();
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
              <i class="fas fa-times" onClick={this.CloseWindow}></i>
            </div>

            <div className="col-md-12 ">
              <div className="row">

              <div className="col-md-8 form__container">
                <input type="text" placeholder="Название" className="form__text" defaultValue={this.state.productName} ref={input => this.NameField = input}/>
                  <input type="text" placeholder="Цена" className="form__text" defaultValue={this.state.productPrice} ref={input => this.PriceField = input}/>
                  <div className="form__select">
                    <button className="select__opener" onClick={this.OnDropDownOpenerClick}>{this.state.selectedCategory}</button>
                    <ul className="select__options" ref={input => this.dropDownSelect = input}>
                      {categoriesSelectRendered}
                    </ul>
                  </div>
                  <textarea cols="30" rows="5" className="form__text" placeholder="Описание" defaultValue={this.state.productDescription} ref={input => this.DescrtiptionField = input}></textarea>
                  <div>
                    <button className="form__button form__button-del" onClick={this.DeleteButtonClick}>Удалить</button>
                    <button className="form__button form__button-save" onClick={this.SaveButtonClick}>Сохранить</button>
                  </div>
                  
              </div>

              <div className="col-md-4 form__container">
              <div className="row">
                <div className="card fixedCard">
                    <img src={this.state.productImage} alt={this.state.productName} className="img-thumbnail"/>
                    
                </div>
              </div>
              <div className="row row-100 row-flex row-column">
                <label className="form__button form__button-fileinput" htmlFor="fileInput">Выбрать файл</label>
                <input id="fileInput" style={{display:"none"}} type="file" accept=".png, .jpg, .jpeg"  ref={input => this.FileField = input} onChange={this.FileSelectionChanged}/>
                <div className="form__inputFileValue" ref={input=>this.PhotoValue = input}>
                  
                </div>
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