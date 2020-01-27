const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');


// router.all('/*',userAuthenticated, (req, res, next)=>{
//     req.app.locals.layout = 'admin';
//     next();
// });

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>{

    res.send("It is working");

});
router.post('/', (req, res)=>{

    Post.findOne({_id: req.body.id}).then(post=>{
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body
        });

        post.comments.push(newComment); //new comment 

        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                req.flash('success_message', `New comment was created successfully.`);
                res.redirect(`/post/${post.id}`);
            })
        });
    });
});

module.exports = router;