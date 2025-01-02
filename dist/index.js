#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const glob_1 = __importDefault(require("glob"));
const utils_1 = require("./utils");
const config_1 = require("./config");
// 创建 CLI 程序
const program = new commander_1.Command();
// 定义 CLI 选项
program
    .version('1.0.0')
    .description('i18nCleaner - 一个国际化清理工具')
    .option('-c, --config <path>', '配置文件路径')
    .option('-i, --include <patterns...>', '包含的目录或文件模式')
    .parse(process.argv);
// 获取 CLI 选项
const options = program.opts();
// 合并配置
const config = Object.assign({}, config_1.defaultConfig);
if (options.include) {
    config.include = options.include;
}
// 主函数
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 收集所有匹配的文件
            let files = [];
            for (const pattern of config.include) {
                const matchedFiles = glob_1.default.sync(pattern, { nodir: true });
                files = files.concat(matchedFiles);
            }
            const totalFiles = files.length;
            if (totalFiles === 0) {
                console.log(chalk_1.default.yellow('没有找到匹配的文件。'));
                return;
            }
            console.log(chalk_1.default.green(`找到 ${totalFiles} 个文件，开始处理...`));
            let processedFiles = 0;
            for (const file of files) {
                try {
                    console.log(chalk_1.default.blue(`正在处理文件: ${file}`));
                    const content = yield (0, utils_1.readFileContent)(file);
                    const newContent = (0, utils_1.replaceI18n)(content);
                    if (newContent !== content) {
                        yield (0, utils_1.writeFileContent)(file, newContent);
                        console.log(chalk_1.default.green(`已更新文件: ${file}`));
                    }
                    else {
                        console.log(chalk_1.default.gray(`文件未变化: ${file}`));
                    }
                    processedFiles++;
                    const progress = ((processedFiles / totalFiles) * 100).toFixed(2);
                    console.log(chalk_1.default.magenta(`进度: ${processedFiles}/${totalFiles} (${progress}%)\n`));
                }
                catch (fileError) {
                    console.error(chalk_1.default.red(`处理文件失败: ${file} - ${fileError.message}`));
                }
            }
            console.log(chalk_1.default.green('所有文件处理完成。'));
        }
        catch (error) {
            console.error(chalk_1.default.red(`发生错误: ${error.message}`));
            process.exit(1);
        }
    });
}
main();
