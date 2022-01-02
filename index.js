const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const exp = require('constants');
const req = require('express/lib/request');
const fs = require('fs');
const nunjucks = require('nunjucks');


const app = express();

// app.use('/', express.static(path.join(__dirname, 'naver')));

app.use(cookieParser(''));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.set('view engine', 'html');

app.set('port', process.env.PORT || 3000);

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/memo/:id', (req, res) => {
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
    }
    var id = req.params.id;
    if(id) {
      fs.readFile('data/'+id, 'utf8', function(err, data){
        if(err){
          console.log(err);
        }
        res.render('view', {title:id, description:data});
      })
    }
  })
});

app.post('/memo', (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/memo/'+title); // 수정필요
  });
})

app.listen(app.get('port'), () => {
  console.log('3000 port connected _ express')
});
