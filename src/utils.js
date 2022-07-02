import { readdir } from 'fs/promises';
import getItemSize from "get-folder-size";
import { lookup } from 'mime-types';

const sizeInMb = (size) => (size / 1000 ** 2).toFixed(2) + ' MB'

const listDirContent = async (path) => {
    const items = await readdir(path, { withFileTypes: true })
    return Promise.all(items.map(async item => {
        const isDir = item.isDirectory();
        const size = await getItemSize.strict([path, item.name].join('/'))
        const mimeType = lookup(item.name);
        return {
            'name': isDir ? item.name : item.name.split('.')[0],
            'type': mimeType ? mimeType.split('/')[0] : 'folder',
            'size': sizeInMb(size),
        }
    }))
}

export { listDirContent }