const express = require('express');
const router = express.Router();
const Post  = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
});

// show front page with all posts
router.get('/',(req, res)=>{
	
	Post.find({}).then(posts=>{
		// console.log(posts);
		Category.find({}).then(categories=>{
			
			const context = {
		        postsDocuments: posts.map(document => {
		          return {
		            id: document._id,
		            title: document.title,
		            body: document.body,
		            status: document.status,
		            allowComments: document.allowComments,
		            date: document.date,
		            file: document.file || "flower.jpg"
		          }
		        })
			};

			const catContext = {
			    categoryDocs: categories.map(document => {
			      return {
			        id: document._id,
			        name: document.name
			      }
			    })
			};

			// console.log(context.postsDocuments);    
		    res.render("home/index", {
		    	posts: context.postsDocuments, 
		    	categories: catContext.categoryDocs
		    });
		});
	});
});

//Show edit post form
router.get('/post/:id', (req, res)=>{
	// res.send(req.params.id);

    Post.findOne({_id: req.params.id})
        .then(post=>{
        	// console.log(post);
    		Category.find({}).then(categories=>{
	    		const postsDocument = {
		            id: post._id,
		            title: post.title,
		            body: post.body,
		            status: post.status,
		            allowComments: post.allowComments,
		            date: post.date,
		            file: post.file || "flower.jpg"
				};
				const catContext = {
				    categoryDocs: categories.map(document => {
				      return {
				        id: document._id,
				        name: document.name
				      }
				    })
				};

	         	res.render('home/post', {
	         		post: postsDocument,
	         		categories: catContext.categoryDocs
	         	});
	        });
    });
});

router.get('/login',(req, res)=>{
	// res.send("home/about");
	res.render("home/login");
});

router.post('/login',(req, res)=>{
	res.send("It works");
});


router.get('/register',(req, res)=>{
	// res.send("home/about");
	res.render("home/register");
});
router.post('/register',(req, res)=>{
	// res.send("It works");
	let errors = [];

    if(!req.body.firstName) {
        errors.push({message: 'Please enter your first name'});
    }

    if(!req.body.lastName) {
        errors.push({message: 'Please add a last name'});
    }

    if(!req.body.email) {
        errors.push({message: 'Please add an email'});
    }

    if(!req.body.password) {
        errors.push({message: 'Please enter a password'});
    }

    if(!req.body.passwordConfirm) {
        errors.push({message: 'This field cannot be blank'});
    }

    if(req.body.password !== req.body.passwordConfirm) {
        errors.push({message: "Password fields don't match"});
    }

    if(errors.length > 0){
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        })

    } else {

        User.findOne({email: req.body.email}).then(user=>{

            if(!user){
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                });

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        newUser.password = hash;

                        newUser.save().then(savedUser=>{
                            req.flash('success_message', 'You are now registered, please login')
                            res.redirect('/login');
                        });
                    })
                });
            } else {
                req.flash('error_message', 'That email exist please login');
                res.redirect('/login');
            }
        });
    }
});


module.exports = router;