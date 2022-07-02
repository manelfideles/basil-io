import express from 'express';
const app = express();
const router = express.Router();
import cors from 'cors'
import multer from 'multer';
import { config } from './config.js';

export {
    express, app, router,
    cors, multer, config,
}