const express = require('express');

const router = express.Router();

router.use('/scannings', require('./scannings'));

module.exports = router;
