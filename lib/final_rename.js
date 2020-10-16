// todo 后续如何查询？读取整个文件到内存的hash中，可以为文件hash，value为path
const utils = require("./files")
const chalk = require("chalk")
const inquirer = require("inquirer")
const fs = require("fs")
const fsPromises = require("fs").promises
const glob = require("glob")
const files = require("./files")
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
              message: "请输入该份报纸的编码，如NY-070-0002。该编码包含两部分，前段为报纸的特藏编号，如NY-070；后段为装订本的流水号如0002。",
            },
          ])
          .then((answers) => {
            let prefixNo = answers.prefixNo.toUpperCase()
            let finalDir = `${utils.operationDir(rootPath)}\\${prefixNo}`
            ;["\\jpg", "\\cr2"].forEach((item) => {
              fsPromises.mkdir(`${finalDir}${item.toLowerCase()}`, {recursive: true}).then(()=>{
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
                        let targetFilePath = `${finalDir}\\${item.toLowerCase()}\\${prefixNo}-${utils.intToFullStringIndexSuffix(
                          i + 1 - dirOffset
                        )}.${file.split(".")[1].toLowerCase()}`
                        fs.renameSync(filePath, targetFilePath)
                      } else {
                        dirOffset += 1
                      }
                    }
                    log(`${item}目录内文件批量重命名完成。`)
                    // rename xls
                    let originXls = `${rootPath}\\${prefixNo}.xlsx`
                    let xlsFile = originXls.replace('xlsx','xlsx')
                    let targetXls =  `${finalDir}\\${prefixNo}.xlsx`
                    let infoFile =  `${finalDir}\\info.txt`
                    if(!fs.existsSync(originXls) && !fs.existsSync(xlsFile)) {
                      throw 'excel目前不存在'
                    }else{
                      if(!fs.existsSync(targetXls)) {
                        if(fs.existsSync(originXls)){
                          fs.renameSync(originXls, targetXls)
                        }
                        if(fs.existsSync(xlsFile)){
                          fs.renameSync(xlsFile, targetXls)
                        }
                      }
                    }
                    if(!fs.existsSync(infoFile)){
                      // create info.txt files, scaner,scandate
                      let infoData = `files:\nscaner:小鄢\nscandate:`
                      fs.writeFileSync(infoFile,infoData)
                    }
                  }
                })
              }).catch(err=>{
                log(err)
                files.waitAndEnterToQuit()
              })
            })
          })
      } else {
        log(chalk.red("请将本程序复制到正确文件夹后再运行一遍"))
      }
    })
  },
}
