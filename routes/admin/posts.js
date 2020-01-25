const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req,res)=>{
	res.send("It works");
});

module.exports = router;