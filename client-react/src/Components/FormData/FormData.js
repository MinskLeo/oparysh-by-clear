import React, { Component } from "react";
import "./FormData.css";

import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";

class FormData extends Component{
  state = {
    items: null,
    pages: null,

    openedPressed: true,
    canceledPressed: true,
    donePressed: true,
    selectedType: "today",
    currentPage: 1
  }

  componentWillMount = () => {
    let requestObject = {
      opened: this.state.openedPressed,
      canceled: this.state.canceledPressed,
      done: this.state.donePressed,
      type: this.state.selectedType,
      page: this.state.currentPage
    }

    axios.post('http://localhost:8080/admin/getformdata', requestObject).then((result) => {
      if (result.data.pages !== 0 && result.data.pages < this.state.currentPage) {
        this.setState({
          items: result.data.items,
          pages: result.data.pages,
          currentPage: 1
        });
      } else {
        this.setState({
          items: result.data.items,
          pages: result.data.pages,
          currentPage: 1
        });
      }


    }).catch((error) => {
      console.log("Error! ajax");
    });
  }

  StatusSortChangeButtons = (button, e) => {
    let btn;
    // Формирование объекта запроса
    let requestObject = {
      opened: this.state.openedPressed,
      canceled: this.state.canceledPressed,
      done: this.state.donePressed,
      type: this.state.selectedType,
      page: this.state.currentPage
    };

    switch (button) {
      case "opened":
      btn = this.state.openedPressed;
        this.setState({
          openedPressed: !btn
        });
        requestObject.opened=!requestObject.opened;
      break;

      case "canceled":
      btn = this.state.canceledPressed;
        this.setState({
          canceledPressed: !btn
        });
        requestObject.canceled=!requestObject.canceled;
      break;

      case "done":
      btn = this.state.donePressed;
        this.setState({
          donePressed: !btn
        });
        requestObject.done=!requestObject.done;
      break;
      default: break;
    }
    

    // Отправка запроса
    axios.post('http://localhost:8080/admin/getformdata', requestObject).then((result) => {
    console.log(requestObject);
      if (result.data.pages!==0 && result.data.pages < this.state.currentPage) {
        this.setState({
          items: result.data.items,
          pages: result.data.pages,
          currentPage: result.data.items.length
        });
      }else{
        this.setState({
          items: result.data.items,
          pages: result.data.pages
        });
      }
      

    }).catch((error) => {
      console.log("Error! ajax");
    });
  }

  OnTypeSelectionChange = (type, e) => {
    this.setState({
      selectedType: type
    });

    let requestObject = {
      opened: this.state.openedPressed,
      canceled: this.state.canceledPressed,
      done: this.state.donePressed,
      type: type,
      page: 1
    }

    axios.post('http://localhost:8080/admin/getformdata', requestObject).then((result) => {
      if (result.data.pages !== 0 && result.data.pages < this.state.currentPage) {
        this.setState({
          items: result.data.items,
          pages: result.data.pages,
          currentPage: 1
        });
      } else {
        this.setState({
          items: result.data.items,
          pages: 1
        });
      }


    }).catch((error) => {
      console.log("Error! ajax");
    });

  }

  


  ChangeBlockStatus = (status,id,index,e) => {
    
  }

  PageChangeEvent = (page, e) => {
      let requestObject = {
      opened: this.state.openedPressed,
      canceled: this.state.canceledPressed,
      done: this.state.donePressed,
      type: this.state.selectedType,
      page: page
    }

    axios.post('http://localhost:8080/admin/getformdata', requestObject).then((result) => {
      this.setState({
        items: result.data.items,
        pages: result.data.pages,
        currentPage: page
      });
    }).catch((error) => {
      console.log("Error! ajax");
    });
  }



  render(){
    let blocksRendered = null;
    let pagesRendered = null;

    if(this.state.items){
        blocksRendered = this.state.items.map((item, index) => {
        let typeProperty = null;
        switch (item.status) {
          case "done":
            typeProperty = "FormDataBock__tape bg-success";
          break;
          case "opened":
            typeProperty = "FormDataBock__tape bg-warning";
          break;
          case "canceled":
            typeProperty = "FormDataBock__tape bg-danger";
          break;
          default: break;
        }
        return(
          <div className="col-md-12 FormDataContentPart__FormDataBock" key={item["_id"]}>
              <div className={typeProperty}></div>
              <h3>{item.name}</h3>
              <p>{item.phone}</p>
              <p>{item.email}</p>
              <p>{item.message}</p>
              <ul className="ChangeType">
                <li className="ChangeType__changer"><button className="FormDataStatusContainer__status FormDataStatusContainer__status-red" onClick={this.ChangeBlockStatus.bind(this,"canceled")}>Отменен</button> </li>
                <li className="ChangeType__changer"><button className="FormDataStatusContainer__status FormDataStatusContainer__status-yellow" onClick={this.ChangeBlockStatus.bind(this,"opened")}>Открыт</button> </li>
                <li className="ChangeType__changer"><button className="FormDataStatusContainer__status FormDataStatusContainer__status-green" onClick={this.ChangeBlockStatus.bind(this,"done")}>Завершен</button> </li>
              </ul>
          </div>
        );
      });

    }
        

    if(this.state.pages){
      let pagesArray = [];
      for(let i=0;i<this.state.pages;i++){
        pagesArray.push(i+1);
      }
      pagesRendered = pagesArray.map((item, index) => {
          return (
            <div key={index} className="page" onClick={this.PageChangeEvent.bind(this,item)}>{item}</div>
          );
      });
    }

    return(
      <div className="row wrap">
        <Sidebar></Sidebar>
        
        <div className="col-md-8">
        
        <div className="FormData">
          <div className="row FormDataStatusContainer">
            <button className="FormDataStatusContainer__status FormDataStatusContainer__status-yellow toggleBtn-opened" onClick={this.StatusSortChangeButtons.bind(this,"opened")}>
              Открытые заказы
            </button>
            <button className="FormDataStatusContainer__status FormDataStatusContainer__status-red toggleBtn-canceled" onClick={this.StatusSortChangeButtons.bind(this,"canceled")}>
              Отмененные заказы
            </button>
            <button className="FormDataStatusContainer__status FormDataStatusContainer__status-green toggleBtn-done" onClick={this.StatusSortChangeButtons.bind(this,"done")}>
              Выполненные заказы
            </button>
          </div>
          <div className="row FormDataContentPart">

            {blocksRendered}

          </div>
          <div className="row FormDataPagesContainer">
            <div className="pages">
              {pagesRendered}
            </div>
          </div>
        </div>
      
         
        </div>

        <div className="col-md-2 Sidebar">

            <ul className="Sidebar__catContainer">
              <li className="catContainer__li"><button className="catContainer__button" onClick={this.OnTypeSelectionChange.bind(this,"today")}>Сегодня</button></li>
              <li className="catContainer__li"><button className="catContainer__button" onClick={this.OnTypeSelectionChange.bind(this,"week")}>Неделя</button></li>
              <li className="catContainer__li"><button className="catContainer__button" onClick={this.OnTypeSelectionChange.bind(this,"month")}>Месяц</button></li>
              <li className="catContainer__li"><button className="catContainer__button" onClick={this.OnTypeSelectionChange.bind(this,"all")}>Все заказы</button></li>
            </ul>

          </div>


      </div>
    );
  }
}

export default FormData;