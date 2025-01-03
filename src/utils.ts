// src/utils.ts

import fs from 'fs-extra';
import chalk from 'chalk';
import { ReplacePattern } from './types';

/**
 * 读取并解析文件内容
 * @param filePath 文件路径
 * @returns 文件内容字符串
 */
export async function readFileContent(filePath: string): Promise<string> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    } catch (error) {
        console.error(chalk.red(`读取文件失败: ${filePath} - ${(error as Error).message}`));
        throw new Error(`读取文件失败: ${filePath} - ${(error as Error).message}`);
    }
}

/**
 * 写入文件内容
 * @param filePath 文件路径
 * @param content 新内容
 */
export async function writeFileContent(filePath: string, content: string): Promise<void> {
    try {
        await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
        console.error(chalk.red(`写入文件失败: ${filePath} - ${(error as Error).message}`));
        throw new Error(`写入文件失败: ${filePath} - ${(error as Error).message}`);
    }
}

/**
 * 替换指定函数调用为指定的内容
 * @param content 文件内容
 * @param patterns 替换规则数组
 * @returns 替换后的内容
 */
/**
 * 替换指定函数调用为指定的内容
 * @param content 文件内容
 * @param patterns 替换规则数组
 * @returns 替换后的内容
 */
export function replaceI18n(content: string, patterns: ReplacePattern[]): string {
    let newContent = content;

    patterns.forEach(({ pattern, replacement }) => {
        // 修改正则表达式以匹配更多情况，包括可选链操作符
        const regex = new RegExp(`\\b${pattern}\\(([^)]+)\\)`, 'g');

        // 修改替换逻辑以处理不同类型的参数
        newContent = newContent.replace(regex, (match, text) => {
            // 检查是否是引号包裹的字符串
            const stringMatch = text.match(/^(['"])(.*?)\1$/);
            
            if (stringMatch) {
                // 如果是字符串，使用原来的替换逻辑
                let result = replacement;
                result = result.replace(/\${quote}/g, stringMatch[1]);
                result = result.replace(/\${text}/g, stringMatch[2]);
                return result;
            } else {
                // 如果不是字符串（例如变量、表达式等），直接将整个参数作为text使用
                let result = replacement;
                result = result.replace(/\${quote}/g, '');
                result = result.replace(/\${text}/g, text.trim());
                return result;
            }
        });
    });

    return newContent;
}


/**
 * 删除指定的行
 * @param content 文件内容
 * @param linesToRemove 要删除的行模式数组
 * @returns 删除后的内容
 */
export function removeLines(content: string, linesToRemove: string[]): string {
    const lines = content.split('\n') || [];
    const filteredLines = lines.filter(line => {
        return !linesToRemove.some(pattern => {
            const regex = new RegExp(pattern);
            return regex.test(line.trim());
        });
    });
    return filteredLines.join('\n');
}
