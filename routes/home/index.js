const express = require('express');
const router = express.Router();
const Post  = require('../../models/Post');
const Category = require('../../models/Category');

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