const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');


// Using Static
app.use(express.static(path.join(__dirname, 'public')));

// Set up View Engine
app.engine('handlebars',exphbs({defaultLayout: 'home'}) )
app.set('view engine', 'handlebars'); 
//handlebars auto search home.hanlebars in layouts folder

// Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');

// Use Routes
app.use('/', home);
app.use('/admin', admin);

// Server
const port = process.env.PORT || 4500;
app.listen(port, ()=>{
	console.log(`listening on port ${port}`);
});