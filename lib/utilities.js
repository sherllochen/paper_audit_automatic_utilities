const inquirer = require("inquirer")

module.exports = {
  waitAndEnterToQuit: () => {
    inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "按Enter退出程序。"
      }
    ]).then((answers) => {
    })
  }
}