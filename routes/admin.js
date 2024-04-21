const express = require('express');
const { createSignupForm, bootstrapField } = require('../forms');
const router = express.Router();

// signup
router.get('/signup', (req, res) => {
    const signupForm = createSignupForm();

    res.render('admin/signup', {
        form: signupForm.toHTML(bootstrapField)
    });
})

router.post('/signup', (req, res) => {
    const signupForm = createSignupForm();
    signupForm.handle(req, {
        'success': async function(form) {
            alert("success")
        },
        'empty': function(form) {
            res.render('admin/signup', {
                form: form.toHTML(bootstrapField)
            })
        },
        'error': function(form) {

            res.render('admin/signup', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})


// login
router.get('/login', (req, res) => {
    res.render('admin/login');
})


module.exports = router;