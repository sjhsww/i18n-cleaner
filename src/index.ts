#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import glob from 'glob';
import { readFileContent, writeFileContent, replaceI18n } from './utils';
import { Config, defaultConfig } from './config';

// 创建 CLI 程序
const program = new Command();

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
const config: Config = { ...defaultConfig };

if (options.include) {
    config.include = options.include;
}

// 主函数
async function main() {
    try {
        // 收集所有匹配的文件
        let files: string[] = [];
        for (const pattern of config.include) {
            const matchedFiles = glob.sync(pattern, { nodir: true });
            files = files.concat(matchedFiles);
        }

        const totalFiles = files.length;
        if (totalFiles === 0) {
            console.log(chalk.yellow('没有找到匹配的文件。'));
            return;
        }

        console.log(chalk.green(`找到 ${totalFiles} 个文件，开始处理...`));

        let processedFiles = 0;

        for (const file of files) {
            try {
                console.log(chalk.blue(`正在处理文件: ${file}`));

                const content = await readFileContent(file);
                const newContent = replaceI18n(content);

                if (newContent !== content) {
                    await writeFileContent(file, newContent);
                    console.log(chalk.green(`已更新文件: ${file}`));
                } else {
                    console.log(chalk.gray(`文件未变化: ${file}`));
                }

                processedFiles++;
                const progress = ((processedFiles / totalFiles) * 100).toFixed(2);
                console.log(chalk.magenta(`进度: ${processedFiles}/${totalFiles} (${progress}%)\n`));
            } catch (fileError:any) {
                console.error(chalk.red(`处理文件失败: ${file} - ${fileError.message}`));
            }
        }

        console.log(chalk.green('所有文件处理完成。'));
    } catch (error:any) {
        console.error(chalk.red(`发生错误: ${error.message}`));
        process.exit(1);
    }
}

main();
