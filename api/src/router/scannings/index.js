const router = require('express').Router();

const addToQueue = require('./addToQueue');
const startScanning = require('./startScanning');
const finishScanning = require('./finishScanning');
const listScanResult = require('./listScanResults');
const getScanResult = require('./getScanResult');

router.post('/add-to-queue', addToQueue.middleware);
router.post('/:id/start', startScanning.middleware);
router.post('/:id/finish', finishScanning.middleware);
router.get('/', listScanResult.middleware);
router.get('/:id', getScanResult.middleware);

module.exports = router;
