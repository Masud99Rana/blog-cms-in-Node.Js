const express = require('express');
const router = express.Router();

router.get('/',(req, res)=>{
	res.render("home/index");
});

router.get('/about',(req, res)=>{
	// res.send("home/about");
	res.render("home/about");
});

router.get('/login',(req, res)=>{
	// res.send("home/about");
	res.render("home/login");
});

router.get('/register',(req, res)=>{
	// res.send("home/about");
	res.render("home/register");
});

module.exports = router;