const express = require('express');
const router = express.Router();

// signup
router.get('/', (req, res) => {

    res.render('landing/home', {
    
    });
})

module.exports = router;