const express = require('express');
const { createSignupForm, bootstrapField } = require('../forms');
const router = express.Router();

// signup
router.get('/signup', (req, res) => {
    const signupForm = createSignupForm();

    res.render('landing/signup', {
        form: signupForm.toHTML(bootstrapField)
    });
})

router.post('/signup', (req, res) => {
    const signupForm = createSignupForm();
    signupForm.handle(req, {
        'success': async function(form) {
            
            // const product = new Product();
            // product.set('name', form.data.name)
            // product.set('cost', form.data.cost);
            // product.set('description', form.data.description);
            // product.set('category_id', form.data.category_id)

            // await product.save();

            // if (form.data.tags) {
            //     await product.tags().attach(form.data.tags.split(','));
            // }
            
            // req.flash('success_messages', 'New product has been created successfully');
            // res.redirect("/products/");
        },
        'empty': function(form) {
            res.render('landing/signup', {
                form: form.toHTML(bootstrapField)
            })
        },
        'error': function(form) {
            res.render('landing/signup', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})


// login
router.get('/login', (req, res) => {
    res.render('landing/login');
})


module.exports = router;