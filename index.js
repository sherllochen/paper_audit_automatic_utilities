const utils = require("./lib/utils");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const combine = require("./lib/combine");
const split = require("./lib/split");
const final_rename = require("./lib/final_rename");
const log = console.log;

clear();
log(chalk.yellow(figlet.textSync("Automatic", { horizontalLayout: "full" })));

inquirer
  .prompt([
    {
      type: "list",
      message: "请选择所需功能",
      name: "selected",
      choices: [
        {
          name: "构建临时审核目录",
          value: "combine",
        },
        {
          name: "拆分到原目录结构",
          value: "split",
        },
        {
          name: "审核完成后的批量重命名",
          value: "rename"
        }
      ],
      validate: function (answer) {
        if (answer.length < 1) {
          return "You must choose at least one topping.";
        }

        return true;
      },
    },
  ])
  .then((answers) => {
    // log(JSON.stringify(answers, null, "  "));
    let selected = answers["selected"];
    // log(selected);
    switch (selected) {
      case "combine":
        combine.process();
        break;
      case "split":
        split.process();
        break;
      case "rename":
        final_rename.process()
    }
  });
