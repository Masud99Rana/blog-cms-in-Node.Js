const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


// DB connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mr-cms',{ useNewUrlParser: true, useUnifiedTopology: true })
	.then(db =>{
    	console.log('mongoDB connected');
	}).catch(error=> console.log(error));


// Using Static
app.use(express.static(path.join(__dirname, 'public')));

// Set up View Engine
const {select} = require('./helpers/handlebars-helpers');

app.engine('handlebars',exphbs({defaultLayout: 'home', helpers:{select:select}}) )
app.set('view engine', 'handlebars'); 
//handlebars auto search home.hanlebars in layouts folder


// Method Override
app.use(methodOverride('_method'));

// Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

// Use Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

// Server
const port = process.env.PORT || 4500;
app.listen(port, ()=>{
	console.log(`listening on port ${port}`);
});