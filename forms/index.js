const forms = require('forms');

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control form-input');
    }

    let validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    let labelStyle = 'style="color: rgba(128, 128, 128, 1);"'; 
    let label = '<label ' + labelStyle + '>' + object.labelHTML(name) + '</label>';
    let error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    let widget = object.widget.toHTML(name, object);
    return '<div class="form-group-wrapper mb-2 mb-md-3">' + label + widget + error + '</div>';
};

const createSignupForm = () => {
    return forms.create({
        'username': fields.string({
            errorAfterField: true, required: validators.required('%s is required')
        }),
        'email': fields.email({
            errorAfterField: true, widget: widgets.email(), required: validators.required('%s is required'),
            validators: [validators.email('Please enter a valid email address')]
        }),
        'password': fields.password({
            errorAfterField: true, required: validators.required('%s is required'),
            validators: [validators.regexp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}$/, "Password must be 8-32 characters, contain 1 uppercase, lowercase, number and special character")]
        }),
        'confirm_password': fields.password({
            label: 'Confirm Password', errorAfterField: true, required: validators.required('%s is required'),
            validators: [validators.matchField('password')],
        })
    }, { validatePastFirstError: true })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.email({
            errorAfterField: true, required: validators.required('%s is required')
        }),
        'password': fields.password({
            errorAfterField: true, required: validators.required('%s is required')
        })
    }, { validatePastFirstError: true })
}

const createVerificationForm = () => {
    return forms.create({
        'token': fields.number({
            errorAfterField: true, required: validators.required('%s is required')
        })
    }, { validatePastFirstError: true })
}

const createForgotPasswordForm = () => {
    return forms.create({
        'email': fields.email({
            errorAfterField: true, required: validators.required('%s is required')
        })
    }, { validatePastFirstError: true })
}

const createUpdatePasswordForm = () => {
    return forms.create({
        'token': fields.number({
            errorAfterField: true, required: validators.required('%s is required')
        }),
        'password': fields.password({
            errorAfterField: true, required: validators.required('%s is required'),
            validators: [validators.regexp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}$/, "Password must be 8-32 characters, contain 1 uppercase, lowercase, number and special character")]
        }),
        'confirm_password': fields.password({
            label: 'Confirm Password', errorAfterField: true, required: validators.required('%s is required'),
            validators: [validators.matchField('password')],
        })
    }, { validatePastFirstError: true })
}

module.exports = { 
    bootstrapField,
    createSignupForm, 
    createLoginForm,
    createVerificationForm,
    createForgotPasswordForm,
    createUpdatePasswordForm
};