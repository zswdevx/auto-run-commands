# 更新日志 (ChangeLog)

所有对"Auto Run Commands for NPM Projects"扩展的显著更改都将记录在此文件中。

格式基于[Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循[语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

## [0.0.1] - 2025-07-25
- 智能条件执行功能，可以根据文件存在或package.json中的脚本决定是否运行命令
- 首次安装时的引导通知
- 通过命令面板访问设置的快捷方式
- 改进了命令执行逻辑，现在会显示更清晰的执行状态

## [0.0.1-dev] - 2025-07-25
- 初始开发版本
- 实现基本功能，支持在工作区打开时自动运行预设命令

### 新增
- 初始版本发布
- 支持在工作区打开时自动运行预设命令
- 支持工作区特定设置和全局默认设置
- 每个命令都在独立的终端中运行
