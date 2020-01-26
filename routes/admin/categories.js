const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});


// Show all categories
router.get('/', (req, res)=>{

    Category.find({}).then(categories=>{

        const context = {
            categoryDocuments: categories.map(document => {
              return {
                id: document._id,
                name: document.name
              }
            })
        };

        res.render('admin/categories/index', {categories: context.categoryDocuments});
    });
});

// Create new Category
router.post('/create', (req, res)=>{

    const newCategory = new Category({
        name: req.body.name
    });

    newCategory.save(savedCategory=>{

        req.flash('success_message', `Category was created successfully.`);
        res.redirect('/admin/categories');
    });
});

// Show Category update form
router.get('/edit/:id', (req, res)=>{
    Category.findOne({_id: req.params.id}).then(category=>{
        const categoryDocument = {
            id: category._id,
            name: category.name
        };

        res.render('admin/categories/edit', {category: categoryDocument});
    });
});

// Update Category
router.put('/edit/:id', (req, res)=>{
    Category.findOne({_id: req.params.id}).then(category=>{
        category.name = req.body.name;

        category.save().then(updatedCategory=>{
            req.flash('success_message', `Category was updated successfully.`);
            res.redirect('/admin/categories');
        });
    });
});

// Delete Category
router.delete('/:id', (req, res)=>{
   Category.remove({_id: req.params.id}).then(deleteCategory=>{
        req.flash('success_message', `Category was deleted successfully.`);
        res.redirect('/admin/categories');
   });
});

module.exports = router;