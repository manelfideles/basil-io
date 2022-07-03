import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import multer from 'multer';
import * as path from 'path';

import {
    listDirContent,
    getDiskStatus,
    getContentDistribution,
    getActivity
} from './utils.js';

const homeDir = process.env.FILES_DIR;
const activityDir = process.env.ACTIVITY_DIR;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

app.listen(process.env.PORT, () => {
    console.log(`⚡ Server is running on http://localhost:${process.env.PORT}.`);
})

app.get('/login', cors(), (req, res) => {
    const password = req.body.password;
    if (password === process.env.PASSWORD) {
        res.send('Manel authenticated! Welcome boss.');
        return;
    } else res.status(500).send('Wrong credentials. Try again.')
})

app.get('/', cors(), async (req, res) => {
    const activity = await getActivity(activityDir);
    const contentDistribution = await getContentDistribution(homeDir);
    const freeSpace = await getDiskStatus(path.resolve(homeDir));
    const content = await listDirContent(homeDir);
    res.send({
        stats: {
            'activity': activity,
            'status': {
                'space': freeSpace,
                'contentDistribution': contentDistribution
            }
        },
        content: content
    });
})

// List items inside a given path
app.get('/:path', cors(), async (req, res) => {
    const path = [homeDir, req.params.path].join('/');
    let content = await listDirContent(path);
    res.send(content);
})

/* 
app.get('/:dir', cors(), async (req, res) => {
    const dir = req.params.dir;
    fs.readdir(`${homeDir}/${dir}`, { withFileTypes: true }, (error, items) => {
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
    const file = fs.createReadStream(`${homeDir}/${dir}/${filename}`);
    file.pipe(res);
    file.on('finish', () => {
        file.close();
    })
})

router.post('/upload', multer({ dest: homeDir }).array(), (req, res) => {
    const title = req.body.title;
    const file = req.file;

    console.log(title);
    console.log(file);

    res.sendStatus(200);
}) */