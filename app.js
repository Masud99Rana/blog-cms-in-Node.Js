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


app.get('/',(req, res)=>{
	res.render("home/index");
});

app.get('/about',(req, res)=>{
	// res.send("home/about");
	res.render("home/about");
});

app.get('/login',(req, res)=>{
	// res.send("home/about");
	res.render("home/login");
});

app.get('/register',(req, res)=>{
	// res.send("home/about");
	res.render("home/register");
});

const port = process.env.PORT || 4500;
app.listen(port, ()=>{
	console.log(`listening on port ${port}`);
});