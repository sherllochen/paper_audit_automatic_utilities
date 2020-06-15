const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd());
    },

    directoryExists: (filePath) => {
        return fs.existsSync(filePath);
    },

    // 存储文件hash
    cacheFilesHash: (rootPath) => {
        let fileHashArray = [];
        let count = 0;
        ['01', '02'].forEach(item => {
            let dirPath = `${rootPath}\\${item}`;
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    console.log(`${dirPath}目录读取错误：${err}`);
                } else {
                    files.forEach((file) => {
                        let filePath = `${dirPath}\\${file}`;
                        if (fs.lstatSync(filePath).isFile()) {
                            let fileHash = md5File.sync(filePath);
                            let record = `${filePath} ${fileHash}`;
                            count += 1;
                            console.log(`${count.toString()} ${record}`);
                            fileHashArray.push(record);
                            debugger
                        }
                    })
                    // 将fileHashArray存储到文件中
                    console.log(fileHashArray.length);
                    debugger
                    fs.writeFile(`${rootPath}\\files_hash.txt`, fileHashArray.join('\r\n'), (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('文件hash编码存储完成');
                    });
                }
            })
        })
    },

    // 创建临时审核目录
    createTempOperationDir: (rootPath) => {
        ['\\JPG\\01', '\\JPG\\02', '\\CR2\\01', '\\CR2\\02'].forEach(item => {
            fs.mkdirSync(`${operationDir(rootPath)}\\${item}`, { recursive: true });
        })
        console.log('临时审核目录创建成功');
    },

    moveFilesToTempDir: (rootPath) => {
        ['01', '02'].forEach(item => {
            let sourcePath = `${rootPath}\\${item}`;
            let dirPath = `${rootPath}\\${item}`;
            fs.readdir(sourcePath, (err, files) => {
                if (err) {
                    console.log(`${sourcePath}目录读取错误：${err}`);
                } else {
                    files.forEach((file) => {
                        let filePath = `${sourcePath}\\${file}`;
                        if (fs.lstatSync(filePath).isFile()) {
                            let fileExtension = path.extname(filePath).replace('.', '');
                            let targetPath = `${operationDir(rootPath)}\\${fileExtension}\\${item}\\${file}`;
                            // fs.copyFileSync(filePath,targetPath);
                            fs.renameSync(filePath, targetPath);
                            console.log(`移动到${targetPath}`);
                        }
                    })
                }
            })
        })
    },

    batchRename: (rootPath) => {
        // ['\\JPG\\01', '\\JPG\\02', '\\CR2\\01', '\\CR2\\02'].forEach(item => {
            let item = '\\JPG\\01';
            let _path = `${this.operationDir(rootPath)}${item}`;
            let prefix
        // })
    },

    operationDir: (rootPath) => {
        return `${rootPath}\\临时审核目录`;
    }
}
