const fs = require("fs")
const path = require("path")
const readline = require("readline")
const log = console.log

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath)
  },

  // 存储文件hash
  cacheFilesHash: (rootPath) => {
    let fileHashArray = []
    let count = 0
    ;["01", "02"].forEach((item) => {
      let dirPath = `${rootPath}\\${item}`
      fs.readdir(dirPath, (err, files) => {
        if (err) {
          log(`${dirPath}目录读取错误：${err}`)
        } else {
          files.forEach((file) => {
            let filePath = `${dirPath}\\${file}`
            if (fs.lstatSync(filePath).isFile()) {
              let fileHash = md5File.sync(filePath)
              let record = `${filePath} ${fileHash}`
              count += 1
              log(`${count.toString()} ${record}`)
              fileHashArray.push(record)
            }
          })
          // 将fileHashArray存储到文件中
          log(fileHashArray.length)
          debugger
          fs.writeFile(
            `${rootPath}\\files_hash.txt`,
            fileHashArray.join("\r\n"),
            (err) => {
              if (err) {
                throw err
              }
              log("文件hash编码存储完成")
            }
          )
        }
      })
    })
  },

  // 创建临时审核目录
  createTempOperationDir: (rootPath) => {
    ;["\\JPG\\01", "\\JPG\\02", "\\CR2\\01", "\\CR2\\02"].forEach((item) => {
      fs.mkdirSync(`${operationDir(rootPath)}\\${item}`, { recursive: true })
    })
    log("临时审核目录创建成功")
  },

  moveFilesToTempDir: (rootPath) => {
    ;["01", "02"].forEach((item) => {
      let sourcePath = `${rootPath}\\${item}`
      let dirPath = `${rootPath}\\${item}`
      fs.readdir(sourcePath, (err, files) => {
        if (err) {
          log(`${sourcePath}目录读取错误：${err}`)
        } else {
          files.forEach((file) => {
            let filePath = `${sourcePath}\\${file}`
            if (fs.lstatSync(filePath).isFile()) {
              let fileExtension = path.extname(filePath).replace(".", "")
              let targetPath = `${operationDir(
                rootPath
              )}\\${fileExtension}\\${item}\\${file}`
              // fs.copyFileSync(filePath,targetPath);
              fs.renameSync(filePath, targetPath)
              log(`移动到${targetPath}`)
            }
          })
        }
      })
    })
  },

  batchRename: (rootPath) => {
    ;["\\JPG\\01", "\\CR2\\01"]
      .forEach((item) => {
        // let item = "\\JPG\\01"
        let _path = `${this.operationDir(rootPath)}${item}`
        let prefix = null
        let suffixInt = 1
        fs.readdir(_path, (err, files) => {
          if (err) {
            log(`${dirPath}目录读取错误：${err}`)
          } else {
            files.forEach((file, _index) => {
              let fullFilePath = `${_path}\\${file}`
              if (_index == 0) {
                prefix = file.substring(0, 6).replace("_", "")
                fs.renameSync(
                  fullFilePath,
                  `${this.operationDir(rootPath)}${item.substring(
                    0,
                    4
                  )}\\${prefix}_${this.intToFullStringIndexSuffix(suffixInt)}`
                )
                suffixInt += 1
              } else {
                fs.renameSync(
                  fullFilePath,
                  `${this.operationDir(rootPath)}${item.substring(
                    0,
                    4
                  )}\\${prefix}_${this.intToFullStringIndexSuffix(suffixInt)}`
                )
                suffixInt += 2
              }
            })
          }
        })
      })
      [("\\JPG\\02", "\\CR2\\02")].forEach((item) => {
        let _path = `${this.operationDir(rootPath)}${item}`
        let prefix = null
        let suffixInt = 3
        fs.readdir(_path, (err, files) => {
          if (err) {
            log(`${dirPath}目录读取错误：${err}`)
          } else {
            for (let i = 0; i < files.length; i++) {
              let file = files[files.length - i - 1]
              _index = i
              let fullFilePath = `${_path}\\${file}`
              if (_index == 0) {
                prefix = file.substring(0, 6).replace("_", "")
              }
              fs.renameSync(
                fullFilePath,
                `${this.operationDir(rootPath)}${item.substring(
                  0,
                  4
                )}\\${prefix}_${this.intToFullStringIndexSuffix(suffixInt)}`
              )
              suffixInt += 2
            }
          }
        })
      })
  },

  operationDir: (rootPath) => {
    return `${rootPath}\\临时审核目录`
  },

  intToFullStringIndexSuffix: (num) => {
    let result = num.toString()
    let full = 4
    let left = full - num.toString().length
    while (left > 0) {
      result = "0" + result
      left -= 1
    }
    return result
  },

  readFilesHashCache: (rootPath) => {
    let resultHash = {}
    const rl = readline.createInterface({
      input: fs.createReadStream(`${rootPath}\\files_hash.txt`),
      output: process.stdout,
      terminal: false,
    })

    rl.on("line", (line) => {
      let parts = line.split(" ")
      resultHash[parts[1]] = parts[0]
    })
    return resultHash
  },

  getOriginalPath: (filePath, allHash) => {
    let fileHash = md5File.sync(filePath)
    return allHash[fileHash]
  },

  moveBackToOriginalPath: (filePath, allHash) => {
    let original = this.getOriginalPath(filePath, allHash)
    if (original !== undefined) {
      fs.rename(filePath, original)
    } else {
      log(`${filePath}未找到原路径`)
    }
  }
}
