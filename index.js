const fs = require('fs');
const files = require('./lib/files');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const md5File = require('md5-file');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Paper', { horizontalLayout: 'full' })
    )
)
// 获取当前目录
// const rootPath = process.cwd();
const rootPath = "D:\\南阳报纸审核目录\\扫描\\测试脚本";
console.log(`当前操作目录是 ${rootPath}`);
// 存储文件hash
// files.cacheFilesHash(rootPath);

// todo 后续如何查询？读取整个文件到内存的hash中，可以为文件hash，value为path

// 创建目录
// files.createTempOperationDir(rootPath);

// 移动文件
// files.moveFilesToTempDir(rootPath);

// 重命名文件
files.batchRename(rootPath);
