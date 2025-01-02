# i18nCleaner

`i18nCleaner` 是一个用于清理国际化（i18n）代码的 CLI 工具。它可以扫描指定目录中的文件，执行以下操作：

- 替换 `t("中文")` 或 `t('中文')` 为 `"中文"`（用户可自定义替换规则）。
- 删除特定的导入语句（例如：`import { useTranslation } from 'react-i18next';`）。
- 删除特定的变量声明（例如：`const { t } = useTranslation();`）。

支持配置文件，配置文件支持 `package.json`、`i18n-cleaner.config.ts`、`i18n-cleaner.config.js`、`i18n-cleaner.config.json`、`i18n-cleaner.config.yaml`、`i18n-cleaner.config.yml` 文件。

## 安装

通过 npm 全局安装：

```bash
npm install -g i18n-cleaner-tool
