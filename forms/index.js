const forms = require('forms');

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
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
    return '<div class="form-group mb-3 mb-md-4">' + label + widget + error + '</div>';
};

const createSignupForm = () => {
    return forms.create({
        'username': fields.string({
            errorAfterField: true, required: validators.required('%s is required')
        }),
        'email': fields.email({
            errorAfterField: true, widget: widgets.email(), required: validators.required('%s is required'),
            validators: [validators.email('Please enter a valid email address')],
            errorMessages: {required: 'Email is required'}
        }),
        'password': fields.password({
            required: true, errorAfterField: true,
            validators: [validators.regexp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}$/)],
            errorMessages: {required: 'Password is required'}
        }),
        'confirm_password': fields.password({
            label: 'Confirm Password', required: true, errorAfterField: true,
            validators: [validators.matchField('password', { message: 'Input do not match password input' })],
            errorMessages: {required: 'Input is required'}
        }),
        'contact': fields.number({
            required: true, errorAfterField: true, errorMessages: {required: 'Contact is required'}
        })
    })
}


module.exports = { createSignupForm, bootstrapField };