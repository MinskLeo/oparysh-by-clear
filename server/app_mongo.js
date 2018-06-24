// Production build INSTRUCTIONS!
// 1. В путях файлов, которые приписываются в роуте /admin/setproduct убрать http://localhost:8080 а так же из deleteproduct
// 2.

// Importing modules
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
// const sql = require ('mysql');

// Multer
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/ProductImages')
  },
  filename: function (req, file, cb) {

    let extension = file.originalname.split('.');
    extension = extension[extension.length-1];

    let id = Math.random().toString(36).substr(2, 9);
    cb(null, id+"."+extension);
  }
})

// var upload = multer({
//   dest: 'ProductImages/'
// })
var upload = multer({
  storage: storage
})

// Setting up some of them
mongoose.connect('mongodb://localhost/oparysh');
app.set("view engine", "ejs");
app.use(bodyParser.json());
// app.use(express.static("ProductImages"));
app.use(express.static("assets"));


// Creating variables
const Product = mongoose.model('Product', {
  name: String,
  image: String,
  description: String,
  price: Number,
  category: String
 });

const Category = mongoose.model('Category', {
  name: String,
  link: String,
  description: String
});

const FormData = mongoose.model('FormData',{
  name: String,
  phone: String,
  email: String,
  message: String,
  dateOfReg: Date,
  dateFinal: Date,
  status: String
})

let categories = [];

// Выборка категорий. Использование:
// CategoriesDatabaseSelection().then( (value)=>{} );
const CategoriesDatabaseSelection = async () => {
  let resultData = null;
  await Category.find({},(err,result) => {
    if(!err){
      resultData = result;
    }
  });
  return await resultData;
}

//sql
/*
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "opatysh"
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  });
});
*/

// SETUP ENDED

app.get('*', (req, res, next) => {
  console.log("Клиент: "+req.url);
  next();
});


app.get('/',  (req, res) => {


  CategoriesDatabaseSelection().then( (value)=>{
    fs.readdir('./assets/ProductImages',(err,files)=>{
      let images = [];
      for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(Math.random() * (files.length-1 - 0 + 1)) + 0;
        images.push(files[randomIndex]);
      }
      console.log(images);
      res.render("index", { categories: value, images: images });
    });



  });


});

app.get('/company', (req, res) => {
   CategoriesDatabaseSelection().then( (value)=>{
    res.render("company", { categories: value });
  });

});

app.get('/cooperation', (req, res) => {
  CategoriesDatabaseSelection().then( (value)=>{
    res.render("cooperation", { categories: value });
  });

});

app.get('/catalog', (req, res) => {
  CategoriesDatabaseSelection().then((value) => {
    res.render("catalog", { categories: value });
  });

});

app.get('/contacts', (req, res) => {
  CategoriesDatabaseSelection().then((value) => {
    res.render("contacts", { categories: value });
  });
});

app.get('/buy', (req, res) => {
  CategoriesDatabaseSelection().then((value) => {
    res.render("wheretobuy", { categories: value });
  });
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.get('/catalog/\*\/', (req, res) => {
  let path = req.url;
  let splitted = path.split('/');
  let categoryInfo = {
    name: null,
    description: null
  };

  // категория - [2]
  // товар - [3]



  // Открытая категория
  if(splitted.length==3){
    /*
    con.connect(function(err) {
      if (err) throw err;
      var sql = "SELECT link FROM category WHERE link = splited[2]";
      con.query(sql, function (err, result) {
        if (err) throw err
        else {
        categoryInfo.name = category[0].name;
        categoryInfo.description = category[0].description;
      };

      var sql = "SELECT category FROM product WHERE product = splited[2]";
      con.query(sql, function (err, result) {
        if (err || result.length == 0) {throw err;   res.render('error', { error: error, categories: value });}
        else {
        res.render('catalog', { items: result, categories: value, categoryInfo: categoryInfo });
      }
      });
    });
    */
      Category.find({ link: splitted[2] },(error,category)=>{
        console.log(category);
        console.log("1. cat");
        if(!error){
          categoryInfo.name = category[0].name;
          categoryInfo.description = category[0].description;
          console.log("2. if");
        }

        Product.find({ category: splitted[2] }, (err, result) => {
          console.log("3. product");
          if (err || result.length == 0) {
            let error = {
              code: 204,
              message: "Контент не найден"
            }
            CategoriesDatabaseSelection().then((value) => {
              res.render('error', { error: error, categories: value });
            });
          } else {
            CategoriesDatabaseSelection().then((value) => {
              console.log("4. render");
              res.render('catalog', { items: result, categories: value, categoryInfo: categoryInfo });
            });
          }
        });


      });



  }else if(splitted.length==4){
  // Открытая категория + товар (открыта страница товара)
    Product.find( { category: splitted[2], _id: splitted[3] } ,(err,result)=>{
        if (err || result.length == 0) {
          let error = {
            code: 204,
            message: "Контент не найден"
          }
          CategoriesDatabaseSelection().then((value) => {
            res.render('error', { error: error, categories: value } );
          });
        }else{
          CategoriesDatabaseSelection().then((value) => {
            console.log(result);
            res.render('productview', { product: result[0], categories: value } );
          });
        }

      });

  }else{
    let error = {
      code: 500,
      message: "Внутренняя ошибка сервера"
    }
    CategoriesDatabaseSelection().then((value) => {
      res.render('error', { error: error, categories: value } );
    });
  }

});


app.post('/admin/login', (req, res) => {
  // console.log(req.body);
  res.send("OK");
});

app.get('/admin/getcategories', (req, res) => {
  let categories = null;
  Category.find({}, (err, result) => {
    if (err) {
      console.log("Error! : " + err.message);
    } else {
      categories = result;
    }
  res.send(categories);

  });
});


app.post('/admin/getcatalog', (req, res) => {
  let category = req.body.category;
  let products = null;

  if(category){
    if (category == "all") {
      Product.find({ }, (err, result) => {
        if (err) {
          console.log("Error! : " + err.message);
        } else {
          products = result;
        }

        res.send(products);
      });
    }else{
      Product.find({
        category: category
      }, (err, result) => {
        if (err) {
          console.log("Error! : " + err.message);
        } else {
          products = result;
        }

        res.send(products);
      });
    }
  }


});

app.post('/admin/delcategory', (req, res) => {
  let resultObj = {
    success: false
  };

  console.log("Delete route!");

/*
con.connect( (err) => {
  if (err) throw err;
  if(req.body.id){
  let sql = "DELETE FROM category WHERE id =  req.body.id" ;
  con.query(sql,(err, result) => {
    if (err) {
      throw err;
    }
    else {
    resultObj = {
      success: true,
      categories: result_find
    }
    res.send(resultObj);
   };
  };
} else {
  res.send(resultObj);
}
  });
});
*/

  if(req.body.id){
    Category.find({ _id: req.body.id }).remove().exec( (err_delete) => {
      if (!err_delete){
        Category.find({},(err_find,result_find)=>{
          if(!err_find){
            resultObj = {
              success: true,
              categories: result_find
            }
            res.send(resultObj);
          }else{
            res.send(resultObj);
          }
        });
      }else{
        res.send(resultObj);
      }
    });
  }
});

app.post('/admin/setcategory', (req, res) => {
  let requestData = req.body;
  let resultObj = null;

  if(requestData){

    Category.findById(requestData.id, (err1,category)=>{
      if(!err1){
        category.set({
          name: requestData.name,
          link: requestData.link,
          description: requestData.description
        });


        category.save((err2) => {
          if (err2) {

            console.log("Error with updating!");
            resultObj = {
              success: false
            }
            res.send(resultObj);

          } else {
            Category.find({}, (err3, result) => {


              if (!err3) {
                resultObj = {
                  success: true,
                  categories: result
                }
              }else{
                resultObj = {
                  success: false
                }
              }

              res.send(resultObj);

            });

          }
        });

      }else{
        console.log("Error! (updating)");
        resultObj = {
          success: false
        }
        res.send(resultObj);
      }

    });

  }
});

app.post('/admin/newcategory', (req, res) => {
  console.log("New Cat!");
  let requestData = req.body;
  let resultObj = {
    success: false
  };

  console.log(requestData);

  if(requestData){
    const newCategory = new Category(requestData);
    newCategory.save( (err1, product)=>{

      if(!err1){
        Category.find({},(err2,result) => {


          if(!err2){
            resultObj = {
              success: true,
              categories: result
            }
            res.send(resultObj);
          }


        });
      }

    });
  }else{
    res.send(resultObj);

  }

});


app.post('/admin/setproduct', upload.single('file'), (req, res) => {
  // console.log("==============file==================");
  Product.findById(req.body.id,(err,product)=>{

    product.name=req.body.name;
    product.category=req.body.category;
    product.price = req.body.price;
    product.description = req.body.description;
    if(req.file){
      let splitted = product.image.split('/');
      fs.access('./assets/ProductImages/' + splitted[splitted.length - 1], fs.constants.F_OK, (err_exists) => {
        if (!err_exists){
          fs.unlinkSync('./assets/ProductImages/' + splitted[splitted.length - 1]);
        }
      });

      product.image = "http://localhost:8080/ProductImages/" + req.file.filename;
    }
    product.save( (error_save,product_save)=>{
      if(!error_save){

        res.send({success: true});
      }else{
        res.send(null);
      }
    });

  });
  console.log("Done!");
  // console.log(req.file);

  // console.log("============body====================");
  // console.log(req.body);
  // console.log("============end====================");
});

app.post('/admin/deleteproduct', (req, res) => {
  let id = req.body.id;
  Product.findById(id,(err_find,product_find)=>{

    if (product_find.image){
      let splitted = product_find.image.split('/');
      fs.access('./assets/ProductImages/' + splitted[splitted.length - 1], fs.constants.F_OK, (err_exists) => {
        if (!err_exists) {
          fs.unlinkSync('./assets/ProductImages/' + splitted[splitted.length - 1]);
        }
      });
    }


    if (!err_find) {
      product_find.remove((err_del, product_del) => {
        if(!err_del){
          res.send({success:true});
        }else{
          res.send(null);
        }
      });
    }
  });
});

app.post('/admin/newproduct', upload.single('file'), (req, res) => {
  let file = null;
  if (req.file){
    file = "http://localhost:8080/ProductImages/" + req.file.filename;
  }


  let product = new Product({
    name : req.body.name,
    category : req.body.category,
    price : req.body.price,
    description : req.body.description,
    image :  file
  });
  product.save( (err_save,product_save)=>{
    if (!err_save) {
      res.send({
        success: true
      });
    }else{
      res.send({
        success: false
      });
    }
  });
});

app.post('/admin/getformdata', (req, res) => {
  // Statuses
  let searchArray = [];
  if(req.body.done){
    searchArray.push("done" );
  }
  if (req.body.opened) {
    searchArray.push("opened");
  }
  if (req.body.canceled) {
    searchArray.push("canceled");
  }

  // Types (today, week, month, all)

  // Pagination
  let itemsPerPage = 15;
  let page = req.body.page;

  let searchObject = {
    status: { $in: searchArray }
  }


  FormData.find({...searchObject})
  .skip((itemsPerPage*page)-itemsPerPage)
  .limit(itemsPerPage)
  .exec( (err_items, result_items) => {
    if (!err_items) {

      FormData.find({ ...searchObject
      }, (err_pages, result_pages) => {
        if (!err_pages) {
          availablePages = Math.ceil(result_pages.length / itemsPerPage);
          let resultObj = {
            items: result_items,
            pages: availablePages
          }
          console.log(resultObj);
          res.send(resultObj);
        }else{
          res.send(null);
        }
      });

    } else {
      res.send(null);
    }
  })
});

app.post('/admin/setformdata', (req, res) => {
  FormData.findById(req.body.id,(err,result)=>{
    result.status=req.body.status;
    result.save( (error,product)=>{
      if(!error){
        res.send({success: true});
      }else{
        res.send({success: false});
      }
    });
  });

});

app.post('/admin/getformdatapages', (req, res) => {
  // Statuses check
  let searchArray = [];
  if (req.body.done) {
    searchArray.push("done");
  }
  if (req.body.opened) {
    searchArray.push("opened");
  }
  if (req.body.canceled) {
    searchArray.push("canceled");
  }
  let searchObject = {
    status: {
      $in: searchArray
    }
  }

  let itemsPerPage = 15;
  let availablePages = null;
  FormData.find({...searchObject},(err,result)=>{
    if(!err){
      availablePages = Math.ceil(result.length / itemsPerPage);
    }
    res.send({
      availablePages: availablePages
    });
  });
});

app.post('/newFormData', (req, res) => {
  let newForm = new FormData({
    name:req.body.name,
    phone:req.body.phone,
    email:req.body.email,
    message:req.body.message,
    dateOfReg:Date.now(),
    dateFinal: null,
    status: "opened"
  });
  newForm.save( ()=>{
    res.send("OK!");
  });
});

// for(let i=6;i<25;i++){
//   let abc = new FormData({
//     name: "Андрей "+i,
//     phone: "+375296655275",
//     email: "2119930@gmail.com",
//     message: "Побыстрее пожалуйста "+i,
//     dateOfReg: Date.now(),
//     dateFinal: null,
//     status: "opened"
//   });
// abc.save();
// }



app.listen(8080,()=>{
  console.log("oparysh.by has been started on: 8080");
});
