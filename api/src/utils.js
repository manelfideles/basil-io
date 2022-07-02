import { readdir, stat } from 'fs/promises';
import getItemSize from "get-folder-size";
import { lookup } from 'mime-types';
import { join } from 'path';
import checkDiskSpace from 'check-disk-space';
import { walk } from '@root/walk';


// get folder's last modified time
const recursiveLastModified = (dir) => {
    if (Array.isArray(dir)) {
        return Math.max.apply(null, dir.map(d => {
            checkArg(d);
            return getLastModifiedRecursive(d);
        }
        ));
    } else {
        return getLastModifiedRecursive(dir);
    }

    function checkArg(candidate) {
        if (typeof candidate !== 'string') {
            throw new Error('Only string or array of string supported in parameter');
        }
    }

    async function getLastModifiedRecursive(candidate) {
        let stats = await stat(candidate);
        let candidateTimes = [stats.mtimeMs, stats.ctimeMs, stats.birthtimeMs];
        if (stats.isDirectory()) {
            let files = await readdir(candidate);
            candidateTimes = candidateTimes.concat(files.map(f => getLastModifiedRecursive(join(candidate, f))));
        }
        return Math.max.apply(null, candidateTimes);
    }
}

const convertSize = (unit, size) => {
    if (unit == 'MB')
        return (size / 10 ** 6).toFixed(2) + ' MB'
    if (unit == 'GB')
        return (size / 10 ** 9).toFixed(2) + ' GB'
}

const listDirContent = async (path) => {
    const items = await readdir(path, { withFileTypes: true })
    return Promise.all(items.map(async item => {
        const cpath = [path, item.name].join('/')
        const isDir = item.isDirectory();
        const size = await getItemSize.strict(cpath)
        const mimeType = lookup(item.name);
        const lastModified = mimeType ? (await stat(cpath)).mtime.toISOString().split('T')[0] : '——'
        return {
            'name': isDir ? item.name : item.name.split('.')[0],
            'type': mimeType ? mimeType.split('/')[0] : 'folder',
            'lastModified': lastModified,
            'size': convertSize('MB', size),
        }
    }))
}

const walkFunc = async (err, dir) => {
    if (err) throw err;
    if (dir.isDirectory() && dir.name.startsWith("."))
        return false;
    const mimeType = lookup(dir.name);
    if (mimeType) console.log(mimeType.split('/')[0]);
    else console.log('folder');
};

const getContentDistribution = async (startDir) => {
    await walk(startDir, walkFunc);
}

const getDiskStatus = async (dir) => {
    const diskSpace = await checkDiskSpace(dir)
    diskSpace['size'] = convertSize('GB', diskSpace['size'])
    diskSpace['free'] = convertSize('GB', diskSpace['free'])
    return diskSpace;
}

export {
    listDirContent,
    recursiveLastModified,
    getDiskStatus,
    getContentDistribution
}