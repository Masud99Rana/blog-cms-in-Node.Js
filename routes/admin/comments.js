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

// show all comments with user relationship
router.get('/', (req, res)=>{

    Comment.find({user: req.user.id}).populate('user').then(comments=>{
        // res.send(comments);

            const context = {
                commentsDocuments: comments.map(document => {
                  return {
                    id: document._id,
                    userName: document.user.firstName,
                    body: document.body,
                    approveComment: document.approveComment,
                    date: document.date
                  }
                })
            };
            // res.send(context.commentsDocuments);
        res.render('admin/comments', {comments: context.commentsDocuments});
    });

});

// insert comment for post
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


router.delete('/:id', (req, res)=>{

    //  DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` 
    //  without the `useFindAndModify` option set to false are deprecated.
    //
    //DeprecationWarning: collection.remove is deprecated. 
    //Use deleteOne, deleteMany, or bulkWrite instead.
    
    Comment.deleteOne({_id: req.params.id}).then(deleteItem=>{
        Post.findOneAndUpdate({comments: req.params.id},
            {$pull: {comments: req.params.id}}, (err, data)=>{
                if(err) console.log(err);

                req.flash('success_message', `The comment was deleted successfully.`);
                res.redirect('/admin/comments');

            });

        });

});

router.post('/approve-comment', (req, res)=>{
    Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result)=>{
        if(err) return err;
        res.send(result)
    });
});

module.exports = router;