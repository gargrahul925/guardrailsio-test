const mongoose = require('mongoose');

const config = require('config');

const ScanResult = require('./scanResult');

const { connection } = mongoose;

const connectDb = () => mongoose.connect(config.get('DB.url'), { useNewUrlParser: true, useUnifiedTopology: true });

// If the connection throws an error
connection.on('error', (err) => {
  console.log('Mongoose default connection error: ', err);
});

// When the connection is disconnected
connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
  });
});

module.exports = { connectDb, ScanResult };
