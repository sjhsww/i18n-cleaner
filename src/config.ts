// src/config.ts

import chalk from 'chalk';
import { cosmiconfig } from 'cosmiconfig';

export interface ReplacePattern {
    pattern: string; // 要替换的函数名称，如 t
    replacement: string; // 替换的内容，如 "${text}"
}

export interface Config {
    include: string[]; // 要包含的目录或文件模式
    exclude?: string[]; // 要排除的目录或文件模式
    replacePatterns?: ReplacePattern[]; // 替换规则
    removeImports?: string[]; // 要删除的导入语句
    removeDeclarations?: string[]; // 要删除的变量声明
    backup?: boolean; // 是否备份原文件
}

export const defaultConfig: Config = {
    include: ["src/**/*.{js,ts,jsx,tsx}"], // 默认包含 src 目录下的所有 JS/TS 文件
    exclude: ["node_modules", "dist"], // 默认排除的目录
    replacePatterns: [
        {
            pattern: "t",
            replacement: "\"${text}\""
        }
    ],
    removeDeclarations: ["const { t } = useTranslation();"],
    backup: false, // 默认不备份
};

/**
 * 使用 cosmiconfig 加载配置文件，支持多种格式
 * @param configPath 配置文件路径
 * @returns 配置对象
 */
export async function loadConfig(configPath: string): Promise<Config> {
    try {
        const explorer = cosmiconfig('i18n-cleaner', {
            searchPlaces: [
                'package.json',
                'i18n-cleaner.config.ts',
                'i18n-cleaner.config.js',
                'i18n-cleaner.config.json',
                'i18n-cleaner.config.yaml',
                'i18n-cleaner.config.yml'
            ],
        });

        const result = await explorer.load(configPath);

        if (!result || !result.config) {
            console.error(chalk.red(`无效的配置文件: ${configPath}`));
            throw new Error(`无效的配置文件: ${configPath}`);
        }

        return result.config as Config;
    } catch (error) {
        console.error(chalk.red(`加载配置文件失败: ${(error as Error).message}`));
        throw new Error(`加载配置文件失败: ${(error as Error).message}`);
    }
}
