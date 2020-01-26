const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const Category = require('../../models/Category')
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

// show all posts
router.get('/',(req,res)=>{
	// res.send("It works");
	Post.find({}).then(posts=>{
		// console.log(posts);
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
		// console.log(context.postsDocuments);
		      
	    res.render('admin/posts', {posts: context.postsDocuments});
	});
});

// Show create post form
router.get('/create', (req, res)=>{
	Category.find({}).then(categories=>{
		const catContext = {
		    categoryDocs: categories.map(document => {
		      return {
		        id: document._id,
		        name: document.name
		      }
		    })
		};
		res.render('admin/posts/create',{categories: catContext.categoryDocs});

	});
});

// Create new Post
router.post('/create',(req,res)=>{
	// res.send('It works');
	// console.log(req.body);
	// console.log(req.body.allowComments);
	// console.log(req.files); must need the module
	
	// let file = req.files.file;
	// let filename = file.name;
	// file.mv('./public/uploads/'+filename, (err)=>{
	// 	if(err) throw err;
	// });
	// 
	let errors = [];

	if(!req.body.title) {
	    errors.push({message: 'Please add a title'});
	}

	if(!req.body.body) {
	    errors.push({message: 'Please add a description'});
	}

	if(errors.length > 0){
	    res.render('admin/posts/create', {
	        errors: errors
	    })

	} else {

		let filename = 'flower.jpg';

		if(!isEmpty(req.files)){
			let file = req.files.file;
			filename = Date.now() + '-' + file.name;

			file.mv(uploadDir + filename, (err)=>{
		    	if(err) throw err;
			});
		}


		let allowComments = true;
		if(req.body.allowComments){
		    allowComments = true;
		} else{
		    allowComments = false;
		}

		const newPost = new Post({
			title: req.body.title,
			status: req.body.status,
			allowComments: allowComments,
			body: req.body.body,
			file: filename,
			category: req.body.category
		});

		
		newPost.save().then(savedPost=>{
			// console.log(savedPost); data we get back
			
			req.flash('success_message', `Post ${savedPost.title} was created successfully.`);
			res.redirect('/admin/posts');
		}).catch(validator=>{
			//console.log(error.errors);
			res.render('admin/posts/create', {errors: validator.errors})
			console.log("Could not saved");
		});
	}
});


//Show edit post form
router.get('/edit/:id', (req, res)=>{
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
		            category: post.category
				};

				const catContext = {
				    categoryDocs: categories.map(document => {
				      return {
				        id: document._id,
				        name: document.name
				      }
				    })
				};

	         	res.render('admin/posts/edit', {
	         		post: postsDocument, 
	         		categories: catContext.categoryDocs
	         	});
    		});
    });
});

//Update post
router.put('/edit/:id', (req,res)=>{
	// res.send('It works');
	
    Post.findOne({_id: req.params.id})
        .then(post=>{
        	// console.log(post);
        	// console.log(req.body.allowComments);
    		
    		let allowComments = true;
			let filename = 'flower.jpg';

			if(req.body.allowComments){
			    allowComments = true;
			} else{
			    allowComments = false;
			}

			if(!isEmpty(req.files)){
			    let file = req.files.file;
			    filename = Date.now() + '-' + file.name;
			    post.file = filename;

			    file.mv('./public/uploads/' + filename, (err)=>{
			        if(err) throw err;
			    });
			}

			post.title = req.body.title;
			post.status = req.body.status;
			post.allowComments = allowComments;
			post.body = req.body.body;
			post.category = req.body.category;

         	post.save().then(updatedPost=>{
         		req.flash('success_message', `Post ${updatedPost.title} was updated successfully.`);
         		res.redirect('/admin/posts');
         	});
    });
});


//Delete post
router.delete('/:id', (req,res)=>{
	// res.send('It works');
	Post.findOne({_id: req.params.id})
	    .then(post =>{
			// res.send('Got it.');
			fs.unlink(uploadDir + post.file, (err)=>{
				post.remove().then(postRemoved=>{
					req.flash('success_message', `Post ${postRemoved.title} was deleted successfully.`);
				    res.redirect('/admin/posts');
				});
			});
	    })
	    .catch(err =>{
			// res.send(err);
			res.send('Vaiya, Posts tatu khuje pacci na');
	    })
});


module.exports = router;