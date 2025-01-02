// src/types.ts

/**
 * 替换模式接口
 */
export interface ReplacePattern {
    pattern: string;       // 要匹配的函数名称，例如 't'
    replacement: string;   // 替换模板，例如 '${quote}${text}${quote}'
}

/**
 * 配置接口
 */
export interface Config {
    include: string[]; // 要包含的目录或文件模式
    exclude?: string[]; // 要排除的目录或文件模式
    replacePatterns?: ReplacePattern[]; // 替换规则
    removeImports?: string[]; // 要删除的导入语句
    removeDeclarations?: string[]; // 要删除的变量声明
    backup?: boolean; // 是否备份原文件
}
