const { getSize, fs } = require('./imports');

const listDirContent = async (path) => {
    const items = await fs.readdir(path, { withFileTypes: true })
    let obj = items.map(item => {
        const isDir = item.isDirectory();
        return {
            name: isDir ? item.name : item.name.split('.')[0],
            isDir: isDir,
            type: isDir ? 'folder' : item.name.split('.')[1],
            size: getSize(path, (err, size) => (size / (1024 * 1024)).toFixed(2) + ' Mb')
        }
    })
    return obj
}

module.exports = { listDirContent }