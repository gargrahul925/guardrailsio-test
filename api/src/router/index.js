const express = require('express');

const router = express.Router();

router.use('/scans', require('./scannings'));

module.exports = router;
