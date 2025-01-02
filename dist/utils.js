"use strict";
// src/utils.ts
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
exports.readFileContent = readFileContent;
exports.writeFileContent = writeFileContent;
exports.replaceI18n = replaceI18n;
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * 读取并解析文件内容
 * @param filePath 文件路径
 * @returns 文件内容字符串
 */
function readFileContent(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield fs_extra_1.default.readFile(filePath, 'utf-8');
            return content;
        }
        catch (error) {
            console.error(chalk_1.default.red(`读取文件失败: ${filePath} - ${error.message}`));
            throw new Error(`读取文件失败: ${filePath} - ${error.message}`);
        }
    });
}
/**
 * 写入文件内容
 * @param filePath 文件路径
 * @param content 新内容
 */
function writeFileContent(filePath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_extra_1.default.writeFile(filePath, content, 'utf-8');
        }
        catch (error) {
            console.error(chalk_1.default.red(`写入文件失败: ${filePath} - ${error.message}`));
            throw new Error(`写入文件失败: ${filePath} - ${error.message}`);
        }
    });
}
/**
 * 替换 t("中文") 或 t('中文') 为 中文
 * @param content 文件内容
 * @returns 替换后的内容
 */
function replaceI18n(content) {
    // 正则匹配 t("...") 或 t('...')
    const regex = /t\((['"])(.*?)\1\)/g;
    return content.replace(regex, (_, quote, text) => `${quote}${text}${quote}`);
}
