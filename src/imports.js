const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const config = require('./config.js');
const getSize = require('get-folder-size');
const fs = require('fs/promises');

module.exports = {
    express, app, router,
    cors, multer, config,
    getSize, fs
}