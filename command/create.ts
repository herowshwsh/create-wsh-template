import path from "path";
import fs from "fs-extra";
import { gt } from "lodash";
import chalk from "chalk";
import axios, { AxiosResponse } from "axios";
import { input, select } from "@inquirer/prompts";
import { clone } from "../utils/clone ";
import { name, version } from "../package.json";
export interface TemplateInfo {
  name: string; // 模板名称
  downloadUrl: string; // 模板下载地址
  description: string; // 模板描述
  branch: string; // 模板分支
}

export const templates: Map<string, TemplateInfo> = new Map([
  [
    "测试一",
    {
      name: "测试一下",
      downloadUrl: "https://gitee.com/wsh001/uniapp-vue3.git",
      description: "测试一描述",
      branch: "master",
    },
  ],
  [
    "测试二",
    {
      name: "测试一下",
      downloadUrl: "git@gitee.com:wsh001/uniapp-vue3.git",
      description: "测试二描述",
      branch: "master",
    },
  ],
]);
export function isOverwrite(fileName: string) {
  console.warn(`${fileName}文件夹存在`);
  return select({
    message: "是否覆盖?",
    choices: [
      { name: "覆盖", value: true },
      { name: "取消", value: false },
    ],
  });
}

export const getNpmInfo = async (npmName: string) => {
  const npmUrl = `https://registry.npmjs.org/${name}`;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (error) {
    console.error(error);
  }
  return res;
};
export const getNpmLatestVersion = async (name: string) => {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  if (data && data["dist-tags"]) {
    return data["dist-tags"].latest;
  } else {
    return "0";
  }
};

export const checkVersion = async (name: string, version: string) => {
  const latestVersion = await getNpmLatestVersion(name);

  const need = gt(latestVersion, version);
  if (need) {
    console.warn(
      `检查到wsh最新版本： ${chalk.blackBright(
        latestVersion
      )}，当前版本是：${chalk.blackBright(version)}`
    );
    console.log(
      `可使用： ${chalk.yellow(
        "npm install create-wsh-cli@latest"
      )}，或者使用：${chalk.yellow("wsh update")}更新`
    );
  }
  return need;
};

export async function create(projectName?: string) {
  // 初始化模板列表
  const templateList = Array.from(templates).map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );
  if (!projectName) {
    projectName = await input({ message: "请输入项目名称" });
  }

  // 如果文件夹存在，则提示是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const run = await isOverwrite(projectName);
    if (run) {
      await fs.remove(filePath);
    } else {
      return; // 不覆盖直接结束
    }
  }

  //   // 检查版本更新
  // await checkVersion(name, version);

  const templateName = await select({
    message: "请选择模板",
    choices: templateList,
  });
  const info = templates.get(templateName);
  console.log(info);
  if (info) {
    clone(info.downloadUrl, projectName, ["-b", info.branch]);
  }

  console.log("create", projectName);
}
