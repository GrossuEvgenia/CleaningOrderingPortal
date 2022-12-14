const express = require('express');
const session=require('express-session');
const router = require('./router/executor.router')
const pool = require('./connection');
//const urlencodedParser = require('body-parser');
let swig = require('twig')

const multer = require('multer');

const PORT = 8000 || process.env.PORT

const app = express();
app.use(multer({dest:'uploads'}).single('photo_link'));
//app.use(urlencodedParser.urlencoded({extended: true}));
//app.use(urlencodedParser.json());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use( session({
  secret: 'you secret key',
  saveUninitialized: false,
  resave: false,
  cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));
app.use(express.static(__dirname + './uploads'));
app.use('/uploads', express.static('uploads'));
app.use('/executors/uploads', express.static('uploads'));
app.use('/executors/update/uploads', express.static('uploads'));
app.use('/executors/updateform/uploads', express.static('uploads'));
//app.use(express.static(__dirname + '/resourse/img/'));
app.use(express.json())
app.use('/', router)

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('views',  __dirname + '/executors')
app.use(express.static(__dirname + '/views/'));
app.use(express.static(__dirname + '/executors/'));
app.get('/', async function (req, res) {
   const executors = await pool.query('select * from executor');
   //console.log(executors);
   const type_executor = await pool.query('select * from type_executor');
   const aria= await pool.query('select * from aria');
   const services= await pool.query('select * from services');
   //console.log(type_executor);
    res.render('executor_list.html', {executors: executors.rows,type_executor: type_executor.rows, session:session, aria:aria.rows,services:services.rows});
});




app.listen(PORT, () => console.log('Server started on port ' + PORT))