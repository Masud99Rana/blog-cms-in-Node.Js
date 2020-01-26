const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')

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
	            allowComments: document.allowComments
	          }
	        })
		};
		// console.log(context.postsDocuments);
		      
	    res.render('admin/posts', {posts: context.postsDocuments});
	});
});

// Show create post form
router.get('/create', (req, res)=>{
	res.render('admin/posts/create');
});

// Create new Post
router.post('/create',(req,res)=>{
	// res.send('It works');
	// console.log(req.body);
	// console.log(req.body.allowComments);
	
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
		body: req.body.body
	});
	
	newPost.save().then(savedPost=>{
		// console.log(savedPost); data we back
		res.redirect('/admin/posts');
	}).catch(error=>{
		console.log("Could not saved");
	});
});


//Show edit post form
router.get('/edit/:id', (req, res)=>{
	// res.send(req.params.id);

    Post.findOne({_id: req.params.id})
        .then(post=>{
        	// console.log(post);
    		
    		const postsDocument = {
	            id: post._id,
	            title: post.title,
	            body: post.body,
	            status: post.status,
	            allowComments: post.allowComments
			};

         	res.render('admin/posts/edit', {post: postsDocument});
    });
});

//Update post
router.put('/edit/:id', (req,res)=>{
	// res.send('It works');
	
    Post.findOne({_id: req.params.id})
        .then(post=>{
        	// console.log(post);
        	console.log(req.body.allowComments);
    		
    		let allowComments = true;
			
			if(req.body.allowComments){
			    allowComments = true;
			} else{
			    allowComments = false;
			}

			post.title = req.body.title;
			post.status = req.body.status;
			post.allowComments = allowComments;
			post.body = req.body.body;

         	post.save().then(updatedPost=>{
         		res.redirect('/admin/posts');
         	})
    });
});


//Delete post
router.delete('/:id', (req,res)=>{
	// res.send('It works');
	Post.findOne({_id: req.params.id})
	    .then(post =>{
			// res.send('Got it.');
			post.remove().then(postRemoved=>{
			    res.redirect('/admin/posts');
			});
	    })
	    .catch(err =>{
			// res.send(err);
			res.send('Vaiya, Posts tatu khuje pacci na');
	    })
});


module.exports = router;