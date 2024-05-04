const express = require('express');
const router = express.Router();

const { bootstrapField, createSignupForm, createLoginForm, createVerificationForm, createForgotPasswordForm, createUpdatePasswordForm } = require('../forms');
const { getHashedPassword, generateAccessToken } = require('../utils');
const adminServices = require('../services/admin_service');

// signup
router.get('/signup', (req, res) => {
    const signupForm = createSignupForm();

    res.render('admin/signup', {
        form: signupForm.toHTML(bootstrapField)
    });
})

router.post('/signup', (req, res) => {
    const signupForm = createSignupForm();

    try {
        signupForm.handle(req, {
            'success': async (form) => {
                const { confirm_password, password, ...formData } = form.data;
                const hashedPassword = await getHashedPassword(password);

                const response = await adminServices.createAdmin({
                    ...formData,
                    password: hashedPassword
                });

                if (response.error) {
                    res.render('admin/signup', {
                        form: form.toHTML(bootstrapField),
                        error: response.error
                    })
                } else {
                    req.flash('success_messages', "Your account has been created successfully!");
                    res.redirect(`/verify?email=${formData.email}&adminId=${response.toJSON().id}`);
                }
            },
            'empty': (form) => {
                res.render('admin/signup', {
                    form: form.toHTML(bootstrapField)
                })
            },
            'error': (form) => {
                res.render('admin/signup', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// login
router.get('/login', (req, res) => {
    const loginForm = createLoginForm();

    res.render('admin/login', {
        form: loginForm.toHTML(bootstrapField)
    });
})

router.post('/login', (req, res) => {
    const loginForm = createLoginForm();
    try {
        loginForm.handle(req, {
            'success': async (form) => {
                const response = await adminServices.getAdminByEmailAndPassword(form.data.email, form.data.password);
                if (response.error) {
                    if (response.error === "Account not verified") {
                        req.flash('error_messages', "Please verify account to login");
                        res.redirect(`/verify?email=${response.data.email}&adminId=${response.data.id}`);
                    } else {
                        res.render('admin/login', {
                            form: form.toHTML(bootstrapField),
                            error: response.error
                        })
                    }
                } else {
                    req.session.user = {
                        id: response.id,
                        username: response.username,
                        email: response.email
                    }
                    req.flash('success_messages', `Welcome back ${response.username}`);
                    res.redirect('/signup');
                }
            },
            'empty': (form) => {
                res.render('admin/login', {
                    form: form.toHTML(bootstrapField)
                })
            },
            'error': (form) => {
                res.render('admin/login', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// verify 
router.get('/verify', (req, res) => {
    const { email } = req.query;
    const verificationForm = createVerificationForm();

    res.render('admin/verify', {
        form: verificationForm.toHTML(bootstrapField),
        email
    });
})

router.post('/verify', (req, res) => {
    const { email, adminId } = req.query;
    const verificationForm = createVerificationForm();
    try {
        verificationForm.handle(req, {
            'success': async (form) => {
                const data = {
                    "type": "Verification",
                    "admin_id": adminId,
                    "token": form.data.token,
                    "profile": "Admin"
                }

                const response = await adminServices.verifyAdmin(email, data);

                if (response.error) {
                    res.render('admin/verify', {
                        form: form.toHTML(bootstrapField),
                        error: response.error,
                        email
                    })
                } else {
                    req.flash('success_messages', "Account has been verified!");
                    res.redirect('/login');
                }
            },
            'empty': (form) => {
                res.render('admin/verify', {
                    form: form.toHTML(bootstrapField),
                    email
                })
            },
            'error': (form) => {
                res.render('admin/verify', {
                    form: form.toHTML(bootstrapField),
                    email
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// forgot password 
router.get('/forgot-password', (req, res) => {
    const forgotPasswordForm = createForgotPasswordForm();

    res.render('admin/forgot-password', {
        form: forgotPasswordForm.toHTML(bootstrapField)
    });
})

router.post('/forgot-password', (req, res) => {
    const forgotPasswordForm = createForgotPasswordForm();

    try {
        forgotPasswordForm.handle(req, {
            'success': async (form) => {

                const response = await adminServices.initiatePasswordReset(form.data.email);

                if (response.error) {
                    res.render('admin/forgot-password', {
                        form: form.toHTML(bootstrapField),
                        error: response.error
                    })
                } else {
                    req.flash('success_messages', "Reset token has been sent!");
                    res.redirect(`/reset-password?email=${response.email}&adminId=${response.id}`);
                }
            },
            'empty': (form) => {
                res.render('admin/forgot-password', {
                    form: form.toHTML(bootstrapField)
                })
            },
            'error': (form) => {
                res.render('admin/forgot-password', {
                    form: form.toHTML(bootstrapField)
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// update password 
router.get('/reset-password', (req, res) => {
    const { email } = req.query;
    const updatePasswordForm = createUpdatePasswordForm();

    res.render('admin/reset-password', {
        form: updatePasswordForm.toHTML(bootstrapField),
        email
    });
})

router.post('/reset-password', (req, res) => {
    const { email, adminId } = req.query;
    const updatePasswordForm = createUpdatePasswordForm();
    try {
        updatePasswordForm.handle(req, {
            'success': async (form) => {
                const data = {
                    "type": "Reset",
                    "admin_id": adminId,
                    "token": form.data.token,
                    "profile": "Admin"
                }

                const response = await adminServices.updatePassword(email, form.data.password, data);

                if (response.error) {
                    res.render('admin/reset-password', {
                        form: form.toHTML(bootstrapField),
                        error: response.error,
                        email
                    })
                } else {
                    req.flash('success_messages', "Password has been reset!");
                    res.redirect('/login');
                }
            },
            'empty': (form) => {
                res.render('admin/reset-password', {
                    form: form.toHTML(bootstrapField),
                    email
                })
            },
            'error': (form) => {
                res.render('admin/reset-password', {
                    form: form.toHTML(bootstrapField),
                    email
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// logout
router.get('/logout',  (req, res) => {
    req.session.user = null;
    req.flash('success_messages', 'Goodbye, you have been logged out')
    res.redirect('/login')
})

module.exports = router;