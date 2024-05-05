const hbs = require('hbs');

hbs.registerHelper('formatDate', (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
});

hbs.registerHelper('formatCost', (cost) => {
    return `$${cost.toFixed(2)}`;
});

hbs.registerHelper('ifEquals', (arg1, arg2, options) => {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('component', (partial, options) => {
    const template = hbs.compile(hbs.partials[partial]);
    const html = template(options.hash);
    return new hbs.SafeString(html);
});

hbs.registerPartial('deletePopupScript', '<script type="text/javascript"></script>');

module.exports = hbs;