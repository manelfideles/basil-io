import {
    express, app, router,
    cors, multer, config
} from './imports.js'
import { listDirContent } from './utils.js';

// Global variables
const { filesDir, ip, port } = config;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`⚡ Server is running on http://localhost:${port}.`);
})

// List items inside a given path
app.get('/:path?', cors(), async (req, res) => {
    const path = [filesDir, req.params.path].join('/');
    let content = await listDirContent(path);
    res.send(content);
})

/* 
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

router.post('/upload', multer({ dest: filesDir }).array(), (req, res) => {
    const title = req.body.title;
    const file = req.file;

    console.log(title);
    console.log(file);

    res.sendStatus(200);
}) */