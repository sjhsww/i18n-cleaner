# i18nCleaner

`i18nCleaner` 是一个用于清理国际化（i18n）代码的 CLI 工具。它可以扫描指定目录中的文件，查找 `t("中文")` 或 `t('中文')` 的模式，并将其替换为 `"中文"`。

## 安装

通过 npm 全局安装：

```bash
npm install -g i18n-cleaner
