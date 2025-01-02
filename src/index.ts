#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import  * as glob from 'glob';
import { readFileContent, writeFileContent, replaceI18n, removeLines } from './utils';
import {  defaultConfig, loadConfig } from './config';
import type { Config } from './types';
import pkg from '../package.json';

const program = new Command();

program
    .version(pkg.version)
    .description('i18nCleaner - 一个国际化清理工具')
    .option('-c, --config <path>', '配置文件路径')
    .option('-i, --include <patterns...>', '包含的目录或文件模式')
    .option('-e, --exclude <patterns...>', '排除的目录或文件模式')
    .option('-r, --replacePattern <pattern>', '要替换的函数名称，默认是 t')
    .option('-b, --backup', '是否在修改文件前备份原文件')
    .parse(process.argv);

const options = program.opts();

/**
 * 合并配置文件和命令行选项
 */
async function getConfig(): Promise<Config> {
    let config: Config = { ...defaultConfig };
    // 如果指定了配置文件，加载并合并
    if (options.config) {
        try {
            const fileConfig = await loadConfig(options.config);
            config = { ...config, ...fileConfig };
            console.log(chalk.green(`已加载配置文件: ${options.config}`));
        } catch (error:any) {
            console.error(chalk.red(error.message));
            process.exit(1);
        }
    }

    // 合并命令行选项（命令行选项优先级高于配置文件）
    if (options.include) {
        config.include = options.include;
    }

    if (options.exclude) {
        config.exclude = config.exclude ? config.exclude.concat(options.exclude) : options.exclude;
    }

    if (options.replacePattern) {
        // 如果命令行只提供一个替换模式，可以将其添加到 replacePatterns
        config.replacePatterns = config.replacePatterns || [];
        config.replacePatterns.push({
            pattern: options.replacePattern,
            replacement: `"${options.replacePattern}"` // 默认替换为字符串
        });
    }

    if (options.backup !== undefined) {
        config.backup = options.backup;
    }

    return config;
}

// 主函数
async function main() {
    try {
        const config = await getConfig();
        // 收集所有匹配的文件
        let files: string[] = [];
        for (const pattern of config.include) {
            const matchedFiles = glob.sync(pattern, { nodir: true, ignore: config.exclude });
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

                // 先删除导入语句
                let newContent = config.removeImports && config.removeImports.length > 0
                    ? removeLines(content, config.removeImports)
                    : content;

                // 删除变量声明
                if (config.removeDeclarations && config.removeDeclarations.length > 0) {
                    newContent = removeLines(newContent, config.removeDeclarations);
                }

                // 进行替换
                if (config.replacePatterns && config.replacePatterns.length > 0) {
                    newContent = replaceI18n(newContent, config.replacePatterns);
                }

                if (newContent !== content) {
                    if (config.backup) {
                        // 创建备份文件
                        const backupPath = `${file}.bak`;
                        await writeFileContent(backupPath, content);
                        console.log(chalk.gray(`已备份原文件: ${backupPath}`));
                    }

                    await writeFileContent(file, newContent);
                    console.log(chalk.green(`已更新文件: ${file}`));
                } else {
                    console.log(chalk.gray(`文件未变化: ${file}`));
                }

                processedFiles++;
                const progress = ((processedFiles / totalFiles) * 100).toFixed(2);
                console.log(chalk.magenta(`进度: ${processedFiles}/${totalFiles} (${progress}%)\n`));
            } catch (fileError) {
                console.error(chalk.red(`处理文件失败: ${file} - ${(fileError as Error).message}`));
            }
        }

        console.log(chalk.green('所有文件处理完成。'));
    } catch (error) {
        console.error(chalk.red(`发生错误: ${(error as Error).message}`));
        process.exit(1);
    }
}

main();
