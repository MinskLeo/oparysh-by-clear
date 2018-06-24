$("document").ready(() => {
  const toggle = $('#toggle');
  const checkbox = $("#m_btn");

  checkbox.change((event) => {
      var checkbox = event.target;
      if (checkbox.checked) {
          //Checkbox has been checked
          toggle.show() ;
      } else {
          //Checkbox has been unchecked
          toggle.hide() ;
      }
  });

 });
