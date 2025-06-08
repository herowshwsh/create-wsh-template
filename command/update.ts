import chalk from "chalk";
import process from "child_process";
import ora from "ora";
const spinner = ora({
  text: "正在更新...",
  spinner: "dots",
});
/**
 * 更新
 */
export function update() {
  spinner.start();
  process.exec(
    "npm install create-wsh-cli@latest -g",
    (err, stdout, stderr) => {
      spinner.stop();
      if (err) {
        spinner.fail(chalk.red("更新失败"));
        console.log(err);
        return;
      }
      spinner.succeed(chalk.green("更新成功"));
      console.log(stdout);
    }
  );
}
