const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const { userAuthenticated } = require('../../helpers/authentication');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res)=>{


    const promises = [
        Post.count().exec(),
        Category.count().exec(),
        Comment.count().exec()
    ];

    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{
        res.render('admin/index',{
                postCount: postCount,
                categoryCount: categoryCount, 
                commentCount: commentCount
            });
    });

    
    // Post.count({}).then(postCount=>{
    //     res.render('admin/index', {postCount: postCount});  
    // });
    
});


router.post('/generate-fake-posts', (req, res)=>{
    for(let i = 0; i < req.body.amount; i++){

        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.file = "flower.jpg";
        post.date = Date.now();
		
		// post.save().then(savedPost=>{
		// 	console.log(i);
		// }).catch(err=>{
		// 	console.log('faker error: ' + err);
		// });

        post.save(function(err){
            if (err) throw err;
			console.log(i);
        });
    }
    res.redirect('/admin/posts');
});



module.exports = router;