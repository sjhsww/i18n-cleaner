// src/utils.ts

import fs from 'fs-extra';
import chalk from 'chalk';

/**
 * 读取并解析文件内容
 * @param filePath 文件路径
 * @returns 文件内容字符串
 */
export async function readFileContent(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error: any) {
    console.error(chalk.red(`读取文件失败: ${filePath} - ${error.message}`));  
    throw new Error(`读取文件失败: ${filePath} - ${error.message}`);
  }
}

/**
 * 写入文件内容
 * @param filePath 文件路径
 * @param content 新内容
 */
export async function writeFileContent(
  filePath: string,
  content: string,
): Promise<void> {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error:any) {
    console.error(chalk.red(`写入文件失败: ${filePath} - ${error.message}`));
    throw new Error(`写入文件失败: ${filePath} - ${error.message}`);
  }
}

/**
 * 替换 t("中文") 或 t('中文') 为 中文
 * @param content 文件内容
 * @returns 替换后的内容
 */
export function replaceI18n(content: string): string {
  // 正则匹配 t("...") 或 t('...')
  const regex = /t\((['"])(.*?)\1\)/g;
  return content.replace(regex, (_, quote, text) => `${quote}${text}${quote}`);
}
