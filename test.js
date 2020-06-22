"use strict"

const files = require("./lib/files")
const clear = require("clear")
const chalk = require("chalk")
const figlet = require("figlet")
const inquirer = require("inquirer")

clear()
log(
  chalk.yellow(figlet.textSync("Only for test", { horizontalLayout: "full" }))
)

let questions = [
  {
    type: "confirm",
    name: "confirmed",
    message: "请确认当前文件夹？确认请输入 y 然后按Enter。",
    default: false,
  },
]
inquirer.prompt(questions).then((answers) => {
  log(JSON.stringify(answers, null, "  "))
  if (answers["confirmed"]) {
    
  } else {
    log("请将本程序复制到正确文件夹后再运行一遍")
  }
})
