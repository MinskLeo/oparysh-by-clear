let formName = document.querySelector('#formName');
let formPhone = document.querySelector('#formPhone');
let formEmail = document.querySelector('#formEmail');
let formMessage = document.querySelector('#formMessage');

let submitBtn = document.querySelector('#submitBtn');



const OnSubmitClick = () => {
  let requestObject = {
    name: formName.value,
    phone: formPhone.value,
    email: formEmail.value,
    message: formMessage.value,
  }
  axios.post('/newFormData',requestObject).then( (result)=>{
    if(result.status=="200"){
      alert("Заказ успешно добавлен!\nОжидайте, с Вами свяжется оператор!");
    }else{
      alert("Произошла ошибка, повторите позже или воспользуйтесь номером телефона для связи");
    }
  }).catch( (error)=>{
    alert("Произошла ошибка, повторите позже или воспользуйтесь номером телефона для связи");
  });

}

submitBtn.addEventListener('click',OnSubmitClick);
