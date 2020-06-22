const files = require('./lib/files');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const combine = require('./lib/combine');
const split = require('./lib/split');
const log = console.log

clear();
log(
    chalk.yellow(
        figlet.textSync('Automatic Utilies', { horizontalLayout: 'full' })
    )
)

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "请选择所需功能",
      name: "selected",
      choices: [
        {
          name: "构建临时审核目录",
          checked: true,
        },
        {
          name: "拆分到原目录结构",
        },
      ],
      validate: function (answer) {
        if (answer.length < 1) {
          return "You must choose at least one topping."
        }

        return true
      },
    },
  ])
  .then((answers) => {
    log(JSON.stringify(answers, null, "  "))
    let selected = answers["selected"][0]
    log(selected)
    switch(selected) {
      case '构建临时审核目录':
        combine.process()
        break;
      case '拆分到原目录结构':
        split.process()
        break;
    }
  })