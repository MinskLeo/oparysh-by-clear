// Importing modules
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const sql = require ('mysql');


//MySQL connection
var connection = require('./configs/mysql_connection');
connection.connect((err) => {
  if (err) {
    console.log("Error with MYSQL connection!");
  } else {
    console.log("Connection established!");
  }
});



// Variables
let accessKey = null;
if (fs.existsSync('access.json')) {
  accessKey = JSON.parse(fs.readFileSync('access.json')).key;
} else {
  console.log("NO ACCESS KEY FILE!");
}
let itemsPerPage = 15;




// Multer
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/ProductImages')
  },
  filename: function (req, file, cb) {

    let extension = file.originalname.split('.');
    extension = extension[extension.length - 1];

    let id = Math.random().toString(36).substr(2, 9);
    cb(null, id + "." + extension);
  }
})


var upload = multer({
  storage: storage
});



// Setting up
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static("assets"));


// Creating variables
let CategoriesDatabaseSelection = () => new Promise( (resolve, reject) => {
    connection.query('SELECT * FROM categories', function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
});


let ProductsDatabaseSelection = () => new Promise( (resolve, reject) => {
  connection.query('SELECT * FROM products', function (error, results) {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
});



// Logging
app.get('*', (req, res, next) => {
  console.log("Клиент GET: " + req.url);
  next();
});
app.post('*', (req, res, next) => {
  console.log("Клиент POST: " + req.url);
  next();
});



app.get('/', (req, res) => {
  CategoriesDatabaseSelection()
  .then( (value) => {
    fs.readdir('./assets/ProductImages', (err, files) => {
      let images = [];
      for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(Math.random() * (files.length - 1 - 0 + 1)) + 0;
        images.push(files[randomIndex]);
      }
      res.render("index", {
        categories: value,
        images: images
      });
    });
  });
});

app.get('/company', (req, res) => {
  CategoriesDatabaseSelection()
  .then((value) => {
    res.render("company", {
      categories: value
    });
  });

});

app.get('/cooperation', (req, res) => {
  CategoriesDatabaseSelection()
  .then((value) => {
    res.render("cooperation", {
      categories: value
    });
  });

});

app.get('/catalog', (req, res) => {
  CategoriesDatabaseSelection()
  .then((value) => {
    res.render("catalog", {
      categories: value
    });
  });

});

app.get('/contacts', (req, res) => {
  CategoriesDatabaseSelection()
  .then( (value) => {
    res.render("contacts", {
      categories: value
    });
  });
});

app.get('/buy', (req, res) => {
  CategoriesDatabaseSelection()
  .then((value) => {
    res.render("wheretobuy", {
      categories: value
    });
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
  if (splitted.length == 3) {
    connection.query('SELECT * from categories WHERE link = ?', [splitted[2]], function (error, category, fields) {
      if(!error){
        categoryInfo.name = category[0].name;
        categoryInfo.description = category[0].description;

        connection.query('SELECT * FROM products WHERE category = ?', [splitted[2]], function (error, products, fields) {
          if (error || products.length === 0){
            CategoriesDatabaseSelection()
            .then( (value) => {
              let error = {
                code: 204,
                message: "Контент не найден"
              }
              res.render('error', {
                error: error,
                categories: value
              });
            });
          }else{
            CategoriesDatabaseSelection()
            .then( (value) => {
              res.render('catalog', {
                items: products,
                categories: value,
                categoryInfo: categoryInfo
              });
            });

          }
        });
      }
    });

  } else if (splitted.length == 4) {
    // Открытая категория + товар (открыта страница товара)
    connection.query('SELECT * FROM products where _id = ? AND category = ?', [ splitted[3], splitted[2] ], function (error, results, fields) {
      if (error || results.length == 0) {
        let error = {
          code: 204,
          message: "Контент не найден"
        }
        CategoriesDatabaseSelection()
        .then( (value) => {
          res.render('error', {
            error: error,
            categories: value
          });
        });
      }else{
        CategoriesDatabaseSelection()
        .then( (value) => {
          res.render('productview', {
            product: results[0],
            categories: value
          });
        });
      }
    });

  } else {
    let error = {
      code: 500,
      message: "Внутренняя ошибка сервера"
    }
    CategoriesDatabaseSelection()
    .then( (value) => {
      res.render('error', {
        error: error,
        categories: value
      });
    });
  }

});


app.post('/admin/login', (req, res) => {
  // console.log(req.body);
  res.send("OK");
});

app.get('/admin/getcategories', (req, res) => {
  CategoriesDatabaseSelection()
  .then( (result)=>{
    res.send(result);
  })
  .catch( (error)=>{
    console.log('Error with GET /admin/getcategories');
    res.sendStatus(403);
  })
});


app.post('/admin/getcatalog', (req, res) => {
  let category = req.body.category;
  console.log(category);
  let sqlString = 'SELECT * FROM products WHERE category = ?';

  if (category) {
    if (category === "all") {
      sqlString = 'SELECT * FROM products';
    }
    connection.query(sqlString, [ category ], function (error, results, fields) {
      if(!error){
        res.send(results);
      }else{
        res.sendStatus(500);
      }
    });
  }
});

app.post('/admin/delcategory', (req, res) => {
  connection.query('DELETE FROM categories WHERE _id = ?', [ req.body._id ], function (error, results, fields) {
    if(!error){
      CategoriesDatabaseSelection()
      .then( (result)=>{
        res.send(result);
      })
      .catch( (error)=>{
        res.sendStatus(500);
      })
    }else{
      console.log("Error in POST /admin/delcategory");
      res.sendStatus(500);
    }
  });
});

app.post('/admin/setcategory', (req, res) => {
  let requestData = {...req.body};
  delete requestData._id;
  connection.query('UPDATE categories SET ? WHERE _id = ?', [ requestData, req.body._id ], function (error, results, fields) {
    if(!error){
      CategoriesDatabaseSelection()
      .then( (result) => {
        res.send(result);
      })
      .catch( (error) => {
        res.sendStatus(500);
      });
    }else{
      res.sendStatus(500);
    }
  });
});

app.post('/admin/newcategory', (req, res) => {
  connection.query('INSERT INTO categories SET ?', [ req.body ], function (error, results, fields) {
    if(!error){
      CategoriesDatabaseSelection()
      .then( (result) => {
        res.send(result);
      })
      .catch( (error) => {
        res.sendStatus(500);
      });
    }else{
      res.sendStatus(500);
    }
  });
});


app.post('/admin/setproduct', upload.single('file'), (req, res) => {
  let requestData = { ...req.body };
  console.log(requestData);
  delete requestData._id;

  // 1. Найти строчку по ID
  // 2. Если есть req.file удалить старый файл
  // 3. Дописать в объект requestData поле image
  if(req.file){
    connection.query('SELECT * FROM products WHERE _id = ?', [ req.body._id ], function (error, results, fields) {

      let splitted = results[0].image.split('/');
      fs.access('./assets/ProductImages/' + splitted[splitted.length - 1], fs.constants.F_OK, (err_exists) => {
        if (!err_exists) {
          fs.unlinkSync('./assets/ProductImages/' + splitted[splitted.length - 1]);
        }
      });

      requestData.image = "../ProductImages/" + req.file.filename;
    });
  }

  connection.query('UPDATE products SET ? WHERE _id = ?', [ requestData, req.body._id ], function (error, results, fields) {
    if(!error){
      ProductsDatabaseSelection
      .then( (result) => {
        res.send(result);
      })
      .catch( (error) => {
        res.sendStatus(500);
      });
    }else{
      console.log(error);
      res.sendStatus(500);
    }
    
  });
});


app.post('/admin/deleteproduct', (req, res) => {
  // ---------------------
  // 1. Приходит id
  // 2. Делаем выборку по id
  // 3. Удаляем файл из папки из поля image
  // 4. Удаляем запись из таблицы
  // 5. Производим выборку по продуктам и отправляем назад
  connection.query('SELECT * FROM products WHERE _id = ?', [ req.body._id ], function (error, results, fields) {
    if(!error){
      let product = results[0];

      if (product.image) {
        let splitted = product.image.split('/');
        fs.access('./assets/ProductImages/' + splitted[splitted.length - 1], fs.constants.F_OK, (err_exists) => {
          if (!err_exists) {
            fs.unlinkSync('./assets/ProductImages/' + splitted[splitted.length - 1]);
          }
        });
      }

      connection.query('DELETE FROM products WHERE _id = ?', [req.body._id], function (error, results, fields) {
        ProductsDatabaseSelection()
        .then( (result)=>{
          res.send(result);
        })
        .catch( (error)=>{
          res.sendStatus(500);
        })
      });

    }else{
      res.sendStatus(500);
    }
  });
});

app.post('/admin/newproduct', upload.single('file'), (req, res) => {
  // --------------
  let requestObject = {...req.body};
  if (req.file) {
    requestObject.image = "../ProductImages/" + req.file.filename;
  }
  delete requestObject._id;

  connection.query('INSERT INTO products SET ?', [ requestObject ], function (error, results, fields) {
    if(!error){
      ProductsDatabaseSelection()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.sendStatus(500);
      })
    }else{
      console.log(error);
      res.sendStatus(500);
    }
  });
});

app.post('/admin/getformdata', (req, res) => {
  console.log(req.body);
  // Statuses
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

  if (searchArray.length===0 || req.body.page === 0) {
    res.send({
      pages: 0,
      items: []
    });
    return;
  }

  // Types
  let fromDate = null;
  let toDate = null;
  let sqlString = 'SELECT * FROM formdata WHERE status IN ( ? ) AND openedDate BETWEEN ? AND ? LIMIT ?, ?';
  let today = new Date();

  // Skip
  let skip = (itemsPerPage * req.body.page) - itemsPerPage;

  switch (req.body.dateset) {
    case 'all':
      connection.query('SELECT * FROM formdata WHERE status IN ( ? ) LIMIT ?, ?', [ searchArray, skip, itemsPerPage ], function (error, results, fields) {
        if (!error) {
          let items = results;
          let formsCount = 0;
          connection.query('SELECT COUNT(_id) AS FormsCount FROM formdata WHERE status IN ( ? )', [ searchArray ], function (error, results, fields){
            if(!error){
              formsCount = results[0].FormsCount;
              let responseObject = {
                pages: Math.ceil(formsCount / itemsPerPage),
                items
              }
              res.send(responseObject);
            }else{
              console.log("2");
              console.log(error);
              res.sendStatus(500);
            }
            
          });

        } else {
          console.log("1");
          console.log(error);
          res.sendStatus(500);
        }
      });
    return;
    case 'today':
      fromDate = today.toLocaleDateString('ru');
      toDate = fromDate;
    break;
    case 'yesterday':
      fromDate = today;
      fromDate.setDate(today.getDate() - 1)
      fromDate = fromDate.toLocaleDateString('ru');
      toDate = fromDate;
    break;
    case 'week':
      fromDate = today;
      fromDate.setDate(today.getDate() - ( today.getDay() - 1) );
      fromDate = fromDate.toLocaleDateString('ru');
      toDate = (new Date() ).toLocaleDateString('ru');
    break;
    case 'month':
      fromDate = new Date(today);
      fromDate.setUTCDate(1);
      toDate = today;
    break;
  }


  connection.query(sqlString, [ searchArray, fromDate, toDate, skip, itemsPerPage ], function (error, results, fields) {
    if(!error){
      let responseObject = {
        pages: Math.ceil(results.length/itemsPerPage),
        items: results
      }
      res.send(responseObject);
    }else{
      res.sendStatus(500);
    }
  });

});

// app.get('/blabla', (req, res) => {
//   requestObject = {
//     name: 'blabla',
//     phone: '375',
//     email: 'blabla@mail.ru',
//     message: 'blablam',
//     status: 'opened',
//     openedDate: (new Date() ).toLocaleDateString('ru')
//   }

//   for(let i=0;i<500;i++){
//     connection.query('INSERT INTO formdata SET ?', [requestObject], function (error, results, fields) {
//     });
//   }
//   res.send("ok");
// });


app.post('/admin/setformdata', (req, res) => {
  console.log(req.body);
  connection.query('UPDATE formdata SET status = ? WHERE _id = ?', [ req.body.status, req.body._id ], function (error, results, fields) {
    if (!error) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });

});

app.post('/newFormData', (req, res) => {
  let requestObject = {...req.body};
  requestObject.status = 'opened';
  requestObject.openedDate = (new Date()).toLocaleDateString('ru');

  connection.query('INSERT INTO formdata SET ?', [ requestObject ], function (error, results, fields) {
    if(!error){
      res.sendStatus(200);
    }else{
      res.sendStatus(500);
    }
  });
});

app.post('/admin/checkpas', (req, res) => {
  let key = req.body.key;
  if (key) {
    console.log("Access: " + accessKey);
    console.log("Key: " + key);
    if (key === accessKey) {
      console.log("Successful login");
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }

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



app.listen(8082, () => {
  console.log(" (vue) oparysh.by has been started on: 8082");
});
