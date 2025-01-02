// src/config.ts
export interface Config {
    include: string[]; // 要包含的目录或文件模式
}

export const defaultConfig: Config = {
    include: ["src/**/*.{js,ts,jsx,tsx}"], // 默认包含 src 目录下的所有 JS/TS 文件
};
