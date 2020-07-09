// todo 后续如何查询？读取整个文件到内存的hash中，可以为文件hash，value为path
const utils = require("./files")
const chalk = require("chalk")
const inquirer = require("inquirer")
const fs = require("fs")
const glob = require("glob")
const log = console.log

module.exports = {
  process: () => {
    log(chalk.bgYellow("== 审核完成后的批量重命名 =="))
    // 获取当前目录
    const rootPath = process.cwd()
    // const rootPath = "D:\\南阳报纸审核目录\\扫描\\华侨商报1957年12月"

    log(chalk.yellow(`当前操作文件夹是 ${rootPath}`))

    let questions = [
      {
        type: "confirm",
        name: "confirmed",
        message: "请确认当前文件夹？确认请输入 y 然后按Enter。",
        default: false,
      },
    ]

    inquirer.prompt(questions).then((answers) => {
      if (answers["confirmed"]) {
        inquirer
          .prompt([
            {
              name: "prefixNo",
              message: "请输入该份报纸的编码，如NY-070：",
            },
          ])
          .then((answers) => {
            let prefixNo = answers.prefixNo.toUpperCase()
            ;["\\JPG", "\\CR2"].forEach((item) => {
              let dirPath = `${utils.operationDir(rootPath)}${item}`
              fs.readdir(dirPath, (err, files) => {
                if (err) {
                  log(`${dirPath}目录读取错误：${err}`)
                } else {
                  let dirOffset = 0
                  for (let i = 0; i < files.length; i++) {
                    let file = files[i]
                    let filePath = `${dirPath}\\${file}`
                    if (fs.lstatSync(filePath).isFile()) {
                      let targetFilePath = `${dirPath}\\${prefixNo}-${utils.intToFullStringIndexSuffix(
                        i + 1 - dirOffset,
                        3
                      )}.${file.split(".")[1]}`
                      fs.renameSync(filePath, targetFilePath)
                    } else {
                      dirOffset += 1
                    }
                  }
                  log(`${item}目录内文件批量重命名完成。`)
                }
              })
            })
          })
      } else {
        log(chalk.red("请将本程序复制到正确文件夹后再运行一遍"))
      }
    })
  },
}
