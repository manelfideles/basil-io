const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

// Global variables
const port = 4000;
const filesDir = '../files';

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`⚡ Server is running on http://localhost:${port}.`);
})

// List dirs inside '/files'
app.get('/', cors(), async (req, res) => {
    fs.readdir(filesDir, { withFileTypes: true }, (error, items) => {
        const obj = items.map(item => {
            return {
                name: item.isDirectory() ? item.name : item.name.split('.')[0],
                isDir: item.isDirectory(),
                type: item.isDirectory() ? null : item.name.split('.')[1]
            }
        })
        res.send(obj);
    })
})

app.get('/:dir', cors(), async (req, res) => {
    const dir = req.params.dir;
    fs.readdir(`${filesDir}/${dir}`, { withFileTypes: true }, (error, items) => {
        const obj = items.map(item => {
            return {
                name: item.isDirectory() ? item.name : item.name.split('.')[0],
                isDir: item.isDirectory(),
                type: item.isDirectory() ? null : item.name.split('.')[1]
            }
        })
        res.send(obj);
    })
})

app.get('/:dir/:filename', cors(), async (req, res) => {
    const dir = req.params.dir;
    const filename = req.params.filename;
    const file = fs.createReadStream(`${filesDir}/${dir}/${filename}`);
    file.pipe(res);
    file.on('finish', () => {
        file.close();
    })
})

/* router.post('/upload', multer({ dest: filesDir }).array(), (req, res) => {
    const title = req.body.title;
    const file = req.file;

    console.log(title);
    console.log(file);

    res.sendStatus(200);
}) */