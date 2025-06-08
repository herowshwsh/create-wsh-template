import { Command } from "commander";
import { version } from "../package.json";
import { create } from "../command/create";
import { update } from "../command/update";
const program = new Command("create-wsh-cli");
program.version(version, "-v", "--version");
program
  .command("create")
  .description("创建一个新项目")
  .argument("[name]", "项目名称")
  .action(async (dirName) => {
    create(dirName);
  });
program
  .command("update")
  .description("更新脚手架 create-wsh-cli")
  .action(async (dirName) => {
    await update();
  });
program.parse();
