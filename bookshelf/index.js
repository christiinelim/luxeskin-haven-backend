const knex = require('knex')(
    {
        client: 'mysql',
        connection: {
            user: 'luxeskinhavenadmin',
            password:'luxeskin',
            database:'skincare',
            host:'127.0.0.1'
        }
    }
);

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;