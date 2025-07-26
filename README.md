[View this in English](./README.en.md)

# Auto Run Commands for NPM Projects 自动命令运行器

这款 VS Code 插件可以在您打开工作区时，自动在集成终端中运行预设的命令。它非常适合用于启动开发服务器、运行构建观察程序或执行任何其他重复性的设置任务。

## ✨ 特性

- **自动执行**：在您打开项目时立即运行您的设置命令。
- **灵活配置**：可以为所有项目设置全局命令，也可以为每个工作区定义特定的命令。
- **工作区优先**：工作区特定的命令总是优先于全局设置。
- **多终端支持**：每条命令都在其专用的集成终端中执行。
- **智能条件执行**：可以设置条件，只在满足特定条件时（如特定文件存在或package.json中包含特定脚本）才执行命令。

## ⚙️ 工作原理

本插件从 VS Code 的设置中读取配置，并采用分层策略：

1.  **工作区设置**：首先，它会在项目特定的 `.vscode/settings.json` 文件中查找命令。如果找到，则执行这些命令。
2.  **全局用户设置**：如果未定义工作区特定的命令，它将回退到全局的 `settings.json` 文件中查找。
3.  **无命令**：如果在两个位置都找不到命令，则不执行任何操作。

**重要提示**：命令是**并行**执行的，每条命令都在自己的终端中运行。这对于启动独立的服务（如前端和后端服务器）非常理想，但不适用于相互依赖的命令（例如，需要先执行 `npm install`，再执行 `npm run build`）。

这种设计允许您为所有项目设置默认命令（例如 `git pull`），并根据具体项目的需求（例如 `npm run dev`）进行覆盖。

## 🚀 使用方法

### 设置工作区特定命令

这是最常见的用例。对于一个特定的项目，您希望运行像 `npm install` 和 `npm run dev` 这样的命令。

1.  在您的项目中，创建或打开 `.vscode/settings.json` 文件。
2.  将您的命令添加到 `autoRunCommands.commands` 数组中：

    ```json
    {
      "autoRunCommands.commands": [
        "cd client && npm run dev",
        "cd server && npm run start"
      ]
    }
    ```

3.  下次您打开这个项目时，这些命令将自动运行。

### 设置全局默认命令

如果您有一些命令希望在*每个*项目（没有自定义工作区配置的项目）中都运行。

1.  打开命令面板 (`Ctrl+Shift+P` 或 `Cmd+Shift+P`)。
2.  搜索并选择 **"首选项: 打开用户设置 (JSON)"** (Preferences: Open User Settings (JSON))。
3.  添加您的全局命令：

    ```json
    {
      // ...您的其他全局设置
      "autoRunCommands.commands": [
        "git pull --rebase",
        "echo '欢迎来到您的项目！'"
      ]
    }
    ```

### 为特定工作区禁用命令

如果您设置了全局命令，但希望在某个特定的工作区中阻止任何命令运行，只需在该工作区的设置中定义一个空数组即可。

1.  打开该项目的 `.vscode/settings.json` 文件。
2.  添加以下配置：

    ```json
    {
      "autoRunCommands.commands": []
    }
    ```

这将覆盖全局设置，并导致不执行任何命令。

### 使用条件命令

为了避免在不适用的项目中运行某些命令（例如，在非前端项目中运行 `npm run dev`），您可以使用条件命令：

1. 打开 `.vscode/settings.json` 文件（针对特定工作区）或全局设置。
2. 使用 `autoRunCommands.commandsWithConditions` 配置：

    ```json
    {
      "autoRunCommands.commandsWithConditions": [
        {
          "command": "npm run dev",
          "condition": {
            "packageScript": "dev"
          }
        },
        {
          "command": "pnpm build",
          "condition": {
            "fileExists": "pnpm-lock.yaml",
            "packageScript": "build"
          }
        }
      ]
    }
    ```

在上面的例子中：
- 第一条命令 `npm run dev` 只会在 package.json 中存在 "dev" 脚本时运行。
- 第二条命令 `pnpm build` 只会在同时满足这两个条件时运行：存在 pnpm-lock.yaml 文件，且 package.json 中有 "build" 脚本。

可用的条件类型：

- `fileExists`: 检查指定文件是否存在（相对于工作区根目录）
- `packageScript`: 检查 package.json 中是否存在指定的脚本

这确保了命令只在适用的项目中运行，避免了不必要的错误和混乱。

---

享受更高效的工作流吧！
