const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

// DB connection
mongoose.Promise = global.Promise;
mongoose.connect(mongoDbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
	.then(db =>{
    	console.log('mongoDB connected');
	}).catch(error=> console.log(error));

mongoose.set('useCreateIndex', true);

// Using Static
app.use(express.static(path.join(__dirname, 'public')));

// Set up View Engine
const {select} = require('./helpers/handlebars-helpers');
const {generateDate} = require('./helpers/handlebars-helpers');
const {paginate} = require('./helpers/handlebars-helpers');

app.engine('handlebars',
    exphbs({
        defaultLayout: 'home',
        helpers:{
            select:select, 
            generateDate: generateDate,
            paginate: paginate
        }
    }));

app.set('view engine', 'handlebars'); 
//handlebars auto search home.hanlebars in layouts folder


// Method Override
app.use(methodOverride('_method'));

// Upload Middleware
app.use(upload());

// Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Session
app.use(session({
    secret: 'masudrana@lovecoding',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


// Passport
app.use(passport.initialize());
app.use(passport.session());


// Local Variables using Middleware
app.use((req, res, next)=>{
    
    let user = req.user || null;
    let auth = {};

    if(user){
        auth = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }else{
        auth = null;
    }

    res.locals.user = auth;

    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');

    next();
});



// Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

// Use Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);

// Server
const port = process.env.PORT || 4500;
app.listen(port, ()=>{
	console.log(`listening on port ${port}`);
});