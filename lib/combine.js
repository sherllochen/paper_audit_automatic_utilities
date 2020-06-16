const files = require("./files")
const chalk = require("chalk")
const inquirer = require("inquirer")

console.log(chalk.yellow("== 构建临时审核目录 =="))
// 获取当前目录
const rootPath = process.cwd()
// const rootPath = "D:\\南阳报纸审核目录\\扫描\\测试脚本"

console.log(chalk.yellow(`当前操作文件夹是 ${rootPath}`))

let questions = [
  {
    type: "confirm",
    name: "confirmed",
    message: "请确认当前文件夹？确认请输入 y 然后按Enter。",
    default: false,
  },
]

inquirer.prompt(questions).then((answers) => {
  // console.log(JSON.stringify(answers, null, "  "))
  if (answers["confirmed"]) {
    let checkQuestion = [
      {
        type: "confirm",
        name: "checkConfirmed",
        message:
          "请检查：01文件夹内首张图片是封面，02文件夹内首张图片是封底。检查完成后按Enter确认。",
        default: true,
      },
    ]
    inquirer.prompt(checkQuestion).then((_answers) => {
      // console.log(JSON.stringify(_answers, null, "  "))
      if (_answers["checkConfirmed"]) {
        console.log(chalk.green("开始执行"))
        // 存储文件hash
        files.cacheFilesHash(rootPath)

        // 创建目录
        files.createTempOperationDir(rootPath)

        // 移动文件
        files.moveFilesToTempDir(rootPath)

        // 重命名文件
        files.batchRename(rootPath)
      }
    })
  } else {
    console.log(chalk.red("请将本程序复制到正确文件夹后再运行一遍"))
  }
})
