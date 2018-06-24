import React, { Component } from "react";
import "./FormData.css";

import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";

class FormData extends Component{
  state = {
    items: null,
    selectedType: "today",
    pagesCount: null,
    currentPage: 1,


    donePressed: true,
    canceledPressed: true,
    openedPressed: true
  }

  GetFormData = (type,buttons,page) => {
    return new Promise( function(resolve,reject){
      axios.post('http://localhost:8080/admin/getformdata', {
        type: type,
        done: buttons.done,
        opened: buttons.opened,
        canceled: buttons.canceled,
        page: page
      }).then((result) => {
        let resultObj = {
          items: result.data.items,
          pages: result.data.pages
        }
        resolve(resultObj);
      }).catch((error) => {
        reject("Error!");
      });
    })
  }
  

  componentWillMount = () => {
    // axios.post('http://localhost:8080/admin/getformdatapages', {
    //   done: this.state.donePressed,
    //   opened: this.state.openedPressed,
    //   canceled: this.state.canceledPressed
    // }).then( (result) => {
    //   this.setState({
    //     pagesCount: result.data.availablePages,
    //   });
    // }).catch( (error) => {
    //   alert("Error!");
    // });

    // axios.post('http://localhost:8080/admin/getformdata', {
    //   type: this.state.selectedType,
    //   done: this.state.donePressed,
    //   opened: this.state.openedPressed,
    //   canceled: this.state.canceledPressed

    // }).then((result) => {
    //   this.setState({
    //     items: result.data
    //   });
    //   console.log(result.data);
    // }).catch((error) => {
    //   alert("Error!");
    // });
    let type = this.state.selectedType;
    let buttons = {
      done: this.state.donePressed,
      opened: this.state.openedPressed,
      canceled: this.state.canceledPressed
    }
    let page = this.state.currentPage;


    this.GetFormData(type,buttons,page).then( (data)=>{
      console.log(data);
      this.setState({
        items: data.items,
        pagesCount: data.pages
      });
    }).catch( (error)=>{
      alert(error);
    })
    

  }

  OnTypeSelectionChange = (type,e) => {
    // axios.post('http://localhost:8080/admin/getformdata', {
    //   type: type,
    //   done: this.state.donePressed,
    //   opened: this.state.openedPressed,
    //   canceled: this.state.canceledPressed,

    // }).then( (result) => {
    //   this.setState({
    //     items: result.data,
    //     selectedType: type
    //   });
    //   console.log(result.data);
    // }).catch( (error) => {
    //   alert("Error!");
    // });
  let buttons = {
    opened: this.state.openedPressed,
    canceled: this.state.canceledPressed,
    done: this.state.donePressed
  }
  this.GetFormData(type, buttons, this.state.currentPage).then((data) => {

    console.log(data);
    this.setState({
      items: data.items,
      pagesCount: data.pages,
      selectedType: type
    });
  }).catch((error) => {
    alert(error);
  });

  }

  SortByStatus = (selectedStatus, e) => {
    let requestObject = null;
    let btn = null;

    switch (selectedStatus) {


      case "opened":
      btn = this.state.openedPressed;
      requestObject = {
        opened: !btn,
        canceled: this.state.canceledPressed,
        done: this.state.donePressed
      }
      this.setState({
        openedPressed: !btn
      });
      e.target.classList.toggle("toggleBtn-opened");
      break;


      case "done":
      btn = this.state.donePressed;
      requestObject = {
        opened: this.state.openedPressed,
        canceled: this.state.canceledPressed,
        done: !btn
      }
      this.setState({
        donePressed: !btn
      });    
      e.target.classList.toggle("toggleBtn-done");
      break;
 

      case "canceled":
        btn = this.state.canceledPressed;
        requestObject = {
          opened: this.state.donePressed,
          canceled: !btn,
          done: this.state.donePressed
        }
        this.setState({
          canceledPressed: !btn
        });
        e.target.classList.toggle("toggleBtn-canceled");
        break;
    }
    
    
    console.log(requestObject);

    // axios.post('http://localhost:8080/admin/getformdata', requestObject).then((result) => {
    //   this.setState({
    //     items: result.data
    //   });
    //   console.log(result.data);
    // }).catch( (error) => {
    //   alert("Error!");
    // });

    // axios.post('http://localhost:8080/admin/getformdatapages', requestObject).then((result) => {
    //   this.setState({
    //     pagesCount: result.data.availablePages,
    //   });
    // }).catch((error) => {
    //   alert("Error!");
    // });
    this.GetFormData(this.state.selectedType,requestObject,this.state.currentPage).then( (data)=>{

    console.log(data);
      this.setState({
        items: data.items,
        pagesCount: data.pages
      });
      if(this.state.currentPage>data.pages){
        this.setState({
          currentPage: data.pages-1
        });
      }

    }).catch((error) => {
      alert(error);
    });
  }

  ChangeBlockStatus = (status,id,index,e) => {
    axios.post('http://localhost:8080/admin/setformdata', {
      id: id,
      status: status
    }).then( (result) => {
      if(result.data.success){
        let itemsCopy = [...this.state.items];
        itemsCopy[index].status=status;
        this.setState({
          items: itemsCopy
        });
      }else{
        alert("Error! 1");
      }
    }).catch( (error) => {
      alert("Error! 2");
    });

  }

  OnPageClick = (page,e) => {
    let buttons = {
      done: this.state.donePressed,
      opened: this.state.openedPressed,
      canceled: this.state.canceledPressed
    }


    this.GetFormData(this.state.selectedType, buttons, page).then((data) => {

      console.log(data);
      this.setState({
        items: data.items,
        pagesCount: data.pages,
        currentPage: page
      });
    }).catch((error) => {
      alert(error);
    });

    // axios.post('http://localhost:8080/admin/getformdata', {
    //   opened: this.state.donePressed,
    //   canceled: this.state.canceledPressed,
    //   done: this.state.donePressed,
    //   page: page,
    //   type: this.state.selectedType
    // }).then( (result) => {  
    //   this.setState({
    //     items: result.data
    //   })
    // }).catch( (error) => {
    //   alert("Error!");
    // });
  }

  render(){
    let blocksRendered = null;
    if(this.state.items){
      blocksRendered = this.state.items.map( (item,index) =>{

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
        }
        return(
          <div className="col-md-12 FormDataContentPart__FormDataBock" key={item["_id"]}>
              <div className={typeProperty}></div>
              <h3>{item.name}</h3>
              <p>{item.phone}</p>
              <p>{item.email}</p>
              <p>{item.message}</p>
              <ul className="ChangeType">
                <li className="ChangeType__changer"><button className="FormDataStatusContainer__status FormDataStatusContainer__status-red" onClick={this.ChangeBlockStatus.bind(this,"canceled",item["_id"],index)}>Отменен</button> </li>
                <li className="ChangeType__changer"><button className="FormDataStatusContainer__status FormDataStatusContainer__status-yellow" onClick={this.ChangeBlockStatus.bind(this,"opened",item["_id"],index)}>Открыт</button> </li>
                <li className="ChangeType__changer"><button className="FormDataStatusContainer__status FormDataStatusContainer__status-green" onClick={this.ChangeBlockStatus.bind(this,"done",item["_id"],index)}>Завершен</button> </li>
              </ul>
          </div>
        );
      });
    }

    let pagesRendered = null;
    if(this.state.pagesCount){
      let pagesArray = [];
      for(let i=0;i<this.state.pagesCount;i++){
        pagesArray.push(i+1);
      }
      pagesRendered = pagesArray.map((item, index) => {
          return (
            <div className="page" onClick={this.OnPageClick.bind(this,item)}>{item}</div>
          );
      });
    }

    return(
      <div className="row wrap">
        <Sidebar></Sidebar>
        
        <div className="col-md-8">
        
        <div className="FormData">
          <div className="row FormDataStatusContainer">
            <button className="FormDataStatusContainer__status FormDataStatusContainer__status-yellow toggleBtn-opened" onClick={this.SortByStatus.bind(this,"opened")}>
              Открытые заказы
            </button>
            <button className="FormDataStatusContainer__status FormDataStatusContainer__status-red toggleBtn-canceled" onClick={this.SortByStatus.bind(this,"canceled")}>
              Отмененные заказы
            </button>
            <button className="FormDataStatusContainer__status FormDataStatusContainer__status-green toggleBtn-done" onClick={this.SortByStatus.bind(this,"done")}>
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