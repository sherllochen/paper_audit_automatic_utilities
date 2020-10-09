// todo 后续如何查询？读取整个文件到内存的hash中，可以为文件hash，value为path
const files = require("./files");
const chalk = require("chalk");
const inquirer = require("inquirer");
const fs = require("fs");
const glob = require("glob");
const log = console.log;

module.exports = {
  process: () => {
    log(chalk.bgYellow("== 拆分到原目录结构 =="));
    // 获取当前目录
    const rootPath = process.cwd();
    // const rootPath = "D:\\南阳报纸审核目录\\扫描\\华侨商报1957年12月";

    log(chalk.yellow(`当前操作文件夹是 ${rootPath}`));

    let questions = [
      {
        type: "confirm",
        name: "confirmed",
        message: "请确认当前文件夹？确认请输入 y 然后按Enter。",
        default: false,
      },
    ];

    inquirer.prompt(questions).then((answers) => {
      // log(JSON.stringify(answers, null, "  "))
      if (answers["confirmed"]) {
        // 检查是否存在files_hash.txt文件
        if (fs.existsSync(`${rootPath}\\${files.hashFileName}`)) {
          log(chalk.green("开始执行"));
          files
            .readFilesHashCache(rootPath)
            .then((allHash) => {
              glob(`${files.operationDir(rootPath)}\\**`, (err, allFiles) => {
                allFiles.forEach((file) => {
                  // let filePath = `${rootPath}\\${file}`
                  // console.log(filePath)
                  if (fs.lstatSync(file).isFile()) {
                    // log(files.getOriginalPath(file,allHash))
                    files.moveBackToOriginalPath(file, allHash);
                  }
                });
              });
            })
            .catch((err) => {
              log(err);
            });
        } else {
          log("该文件夹未进行过合并操作，无法复原");
          files.waitAndEnterToQuit();
        }
      } else {
        log(chalk.red("请将本程序复制到正确文件夹后再运行一遍"));
        files.waitAndEnterToQuit();
      }
    });
  },
};
