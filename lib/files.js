const fs = require("fs")
const fsPromises = require("fs").promises
const path = require("path")
const readline = require("readline")
const md5File = require("md5-file")
const log = console.log
// 文件hash缓存文件
const hashFileName = "files_hash.txt"

function operationDir(rootPath) {
  return `${rootPath}\\临时审核目录`
}

function intToFullStringIndexSuffix(num) {
  let result = num.toString()
  let full = 4
  let left = full - num.toString().length
  while (left > 0) {
    result = "0" + result
    left -= 1
  }
  return result
}

function getOriginalPath(filePath, allHash) {
  let fileHash = md5File.sync(filePath)
  return allHash[fileHash]
}

// readFilesHashCache: (rootPath) => {
//   let resultHash = {}
//   const rl = readline.createInterface({
//     input: fs.createReadStream(`${rootPath}\\${hashFileName}`),
//     output: process.stdout,
//     terminal: false,
//   })

//   rl.on("line", (line) => {
//     let parts = line.split(" ")
//     resultHash[parts[1]] = parts[0]
//     console.log(resultHash)
//   })
//   console.log('last')
//   console.log(resultHash)
//   return resultHash
// },

module.exports = {
  hashFileName: hashFileName,
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath)
  },

  // 存储文件hash
  cacheFilesHash: (rootPath) => {
    return new Promise(function (resolve, reject) {
      try {
        if (fs.existsSync(`${rootPath}\\${hashFileName}`)) {
          resolve()
        } else {
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
                log(`总文件数量：${fileHashArray.length}`)
                fs.writeFile(
                  `${rootPath}\\${hashFileName}`,
                  fileHashArray.join("\r\n"),
                  (err) => {
                    if (err) {
                      throw err
                    }
                    log("文件hash编码存储完成")
                    resolve()
                  }
                )
              }
            })
          })
        }
      } catch (err) {
        console.error(`cacheFilesHash: ${err}`)
        reject(err)
      }
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
    return new Promise(function (resolve, reject) {
      try {
        pathPair = []
        ;["01", "02"].forEach((item) => {
          let sourcePath = `${rootPath}\\${item}`
          let dirPath = `${rootPath}\\${item}`
          log(sourcePath)
          let files = fs.readdirSync(sourcePath)
          files.forEach((file) => {
            let filePath = `${sourcePath}\\${file}`
            if (fs.lstatSync(filePath).isFile()) {
              let fileExtension = path.extname(filePath).replace(".", "")
              let targetPath = `${operationDir(
                rootPath
              )}\\${fileExtension}\\${item}\\${file}`
              pathPair.push({ origin: filePath, target: targetPath })
            }
          })
        })
        let moveFinshedCount = 0
        let renamePromises = pathPair.map((item) => {
          new Promise((renameResolve, renameReject) => {
            fsPromises
              .rename(item["origin"], item["target"])
              .then(() => {
                log(`移动 ${item["origin"]} 到 ${item["target"]}`)
                moveFinshedCount += 1
                renameResolve()
              })
              .catch((err) => {
                renameReject(err)
              })
          })
        })
        Promise.all(renamePromises).then(() => {
          // repeat with the interval of 2 seconds
          let timerId = setInterval(() => {
            if (moveFinshedCount == pathPair.length) {
              clearInterval(timerId)
              log('SSSSSSSSSSSSSSS全部重命名结束后reslove')
              resolve()
            } else {
              log("还没重命名完...")
            }
          }, 100)
        })
      } catch (err) {
        console.error(`moveFilesToTempDir: ${err}`)
        reject(err)
      }
    })
  },

  batchRename: (rootPath) => {
    ;["\\JPG\\01", "\\CR2\\01"].forEach((item) => {
      let fileExtension = item.split("\\")[1]
      let _path = `${operationDir(rootPath)}${item}`
      let prefix = null
      let suffixInt = 1
      fs.readdir(_path, (err, files) => {
        if (err) {
          log(`${_path}目录读取错误：${err}`)
        } else {
          files.forEach((file, _index) => {
            let fullFilePath = `${_path}\\${file}`
            if (_index == 0) {
              prefix = file.split("-").splice(0, 2).join("")
              let targetPath = `${operationDir(rootPath)}${item.substring(
                0,
                4
              )}\\${prefix}_${intToFullStringIndexSuffix(
                suffixInt
              )}.${fileExtension}`
              log(`重命名 ${fullFilePath} 为 ${targetPath}`)
              fs.renameSync(fullFilePath, targetPath)
              suffixInt += 1
            } else {
              let targetPath = `${operationDir(rootPath)}${item.substring(
                0,
                4
              )}\\${prefix}_${intToFullStringIndexSuffix(
                suffixInt
              )}.${fileExtension}`
              log(`重命名 ${fullFilePath} 为 ${targetPath}`)
              fs.renameSync(fullFilePath, targetPath)
              suffixInt += 2
            }
          })
        }
      })
    })
    ;["\\JPG\\02", "\\CR2\\02"].forEach((item) => {
      let fileExtension = item.split("\\")[1]
      let _path = `${operationDir(rootPath)}${item}`
      let prefix = null
      let suffixInt = 3
      fs.readdir(_path, (err, files) => {
        if (err) {
          log(`${_path}目录读取错误：${err}`)
        } else {
          for (let i = 0; i < files.length; i++) {
            let file = files[files.length - i - 1]
            _index = i
            let fullFilePath = `${_path}\\${file}`
            if (_index == 0) {
              prefix = file.split("-").splice(0, 2).join("")
            }
            let targetPath = `${operationDir(rootPath)}${item.substring(
              0,
              4
            )}\\${prefix}_${intToFullStringIndexSuffix(
              suffixInt
            )}.${fileExtension}`
            log(`重命名 ${fullFilePath} 为 ${targetPath}`)
            fs.renameSync(fullFilePath, targetPath)
            suffixInt += 2
          }
        }
      })
    })
  },

  operationDir: operationDir,
  intToFullStringIndexSuffix: intToFullStringIndexSuffix,

  readFilesHashCache: (rootPath) => {
    return new Promise(function (resolve, reject) {
      try {
        let resultHash = {}
        let hashFilePath = `${rootPath}\\${hashFileName}`
        const rl = readline.createInterface({
          input: fs.createReadStream(hashFilePath),
          output: process.stdout,
          terminal: false,
        })

        rl.on("line", (line) => {
          let parts = line.split(" ")
          resultHash[parts[1]] = parts[0]
        }).on("close", () => {
          resolve(resultHash)
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  },
  getOriginalPath: getOriginalPath,

  moveBackToOriginalPath: (filePath, allHash) => {
    let original = getOriginalPath(filePath, allHash)
    if (original !== undefined) {
      fs.renameSync(filePath, original)
      log(`恢复到 ${original}`)
    } else {
      log(`${filePath}未找到原路径`)
    }
  },
}
