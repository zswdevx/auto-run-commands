# VS Code扩展发布流程指南

本文档详细记录了如何手动发布"Auto Run Commands"扩展到VS Code Marketplace的步骤。

## 前提条件

1. **Personal Access Token (PAT)**
   - 确保您已从[VS Code Marketplace发布页面](https://marketplace.visualstudio.com/manage)获取了Personal Access Token
   - 如果没有，请按照[官方文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)创建

2. **发布者账号**
   - 确保您已在VS Code Marketplace注册了发布者账号
   - 当前发布者ID: `zswdevx`

## 发布步骤

### 1. 准备发布

1. **确保代码质量**
   ```bash
   # 运行所有检查，包括linting、格式检查、编译和打包
   pnpm run prepublish-checks
   ```

2. **更新版本号**
   ```bash
   # 更新补丁版本 (0.0.1 -> 0.0.2)
   pnpm run version:patch

   # 或者更新次要版本 (0.0.1 -> 0.1.0)
   pnpm run version:minor

   # 或者更新主要版本 (0.0.1 -> 1.0.0)
   pnpm run version:major
   ```
   这将自动:
   - 更新package.json中的版本号
   - 更新CHANGELOG.md中的版本和日期

3. **验证CHANGELOG.md**
   - 检查CHANGELOG.md是否正确反映了所有更改
   - 如有需要，手动编辑以添加更多详细信息

### 2. 发布到VS Code Marketplace

1. **登录并发布**
   ```bash
   # 如果是首次使用，需要先登录
   pnpm dlx vsce login zswdevx

   # 发布扩展
   pnpm run publish
   ```
   或者，您也可以直接使用PAT:
   ```bash
   pnpm dlx vsce publish -p <your-pat-here>
   ```

2. **验证发布**
   - 访问[您的发布者页面](https://marketplace.visualstudio.com/publishers/zswdevx)
   - 确认新版本已成功发布

### 3. 创建Git标签和提交

1. **提交版本更改**
   ```bash
   git add .
   git commit -m "release: version x.y.z"
   ```

2. **创建Git标签**
   ```bash
   git tag v{x.y.z}  # 例如 v0.1.0
   ```

3. **推送更改和标签**
   ```bash
   git push && git push --tags
   ```

## 常见问题和解决方案

### 发布失败

- **问题**: `The Personal Access Token is incorrect or has expired`
  - **解决方案**: 更新您的PAT，确保它有正确的权限

- **问题**: `Extension with id 'auto-run-commands' is already published`
  - **解决方案**: 确保您已更新package.json中的版本号

### 版本管理

- **开发版本**: 使用 `-dev` 后缀（例如 `0.0.1-dev`）
- **预发布版本**: 使用 `-alpha`, `-beta` 或 `-rc` 后缀
  ```bash
  # 创建预发布版本
  pnpm run version:prerelease
  ```

## 参考资料

- [VS Code发布扩展官方文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce工具文档](https://github.com/microsoft/vscode-vsce)
- [语义化版本](https://semver.org/lang/zh-CN/)
