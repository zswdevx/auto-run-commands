import * as vscode from 'vscode'

import * as fs from 'fs'

import * as path from 'path'

interface CommandConfig {
  command: string

  condition?: {
    fileExists?: string

    packageScript?: string
  }
}

export function activate(context: vscode.ExtensionContext) {
  // 注册配置命令

  const configureCommand = vscode.commands.registerCommand(
    'autoRunCommands.configureCommands',

    () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'autoRunCommands')
    },
  )

  context.subscriptions.push(configureCommand)

  // 如果是首次安装，显示配置通知

  const hasShownNotification = context.globalState.get('autoRunCommands.hasShownNotification')

  if (!hasShownNotification) {
    showConfigurationNotification()

    context.globalState.update('autoRunCommands.hasShownNotification', true)
  }

  const config = vscode.workspace.getConfiguration('autoRunCommands')

  const legacyConfigInfo = config.inspect<string[]>('commands')

  const configInfo = config.inspect<CommandConfig[]>('commandsWithConditions')

  // 首先尝试获取新格式的命令配置

  let commandsToRun: CommandConfig[] = []

  // 处理新格式的命令（带条件）

  if (configInfo?.workspaceValue !== undefined) {
    console.log('Auto Run Command: Found commands with conditions in workspace settings.')

    commandsToRun = configInfo.workspaceValue
  } else if (configInfo?.globalValue !== undefined) {
    console.log('Auto Run Command: Found commands with conditions in global user settings.')

    commandsToRun = configInfo.globalValue
  }

  // 如果没有找到新格式的命令，尝试处理旧格式的命令
  else if (legacyConfigInfo?.workspaceValue !== undefined) {
    console.log('Auto Run Command: Found legacy commands in workspace settings.')

    commandsToRun = legacyConfigInfo.workspaceValue.map(cmd => ({ command: cmd }))
  } else if (legacyConfigInfo?.globalValue !== undefined) {
    console.log('Auto Run Command: Found legacy commands in global user settings.')

    commandsToRun = legacyConfigInfo.globalValue.map(cmd => ({ command: cmd }))
  }

  if (commandsToRun.length > 0) {
    const workspaceFolders = vscode.workspace.workspaceFolders

    if (!workspaceFolders) {
      console.log('Auto Run Command: No workspace folder found.')

      return
    }

    const rootPath = workspaceFolders[0].uri.fsPath

    const validCommands = commandsToRun.filter(cmdConfig => {
      if (!cmdConfig.condition) {
        return true // 没有条件的命令始终执行
      }

      // 检查文件是否存在

      if (cmdConfig.condition.fileExists) {
        const filePath = path.join(rootPath, cmdConfig.condition.fileExists)

        if (!fs.existsSync(filePath)) {
          console.log(
            `Auto Run Command: Skipping command "${cmdConfig.command}" - required file not found: ${cmdConfig.condition.fileExists}`,
          )

          return false
        }
      }

      // 检查package.json中是否存在指定脚本

      if (cmdConfig.condition.packageScript) {
        const packageJsonPath = path.join(rootPath, 'package.json')

        if (!fs.existsSync(packageJsonPath)) {
          console.log(
            `Auto Run Command: Skipping command "${cmdConfig.command}" - package.json not found`,
          )

          return false
        }

        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

          if (!packageJson.scripts || !packageJson.scripts[cmdConfig.condition.packageScript]) {
            console.log(
              `Auto Run Command: Skipping command "${cmdConfig.command}" - script not found: ${cmdConfig.condition.packageScript}`,
            )

            return false
          }
        } catch (error) {
          console.error('Auto Run Command: Error parsing package.json', error)

          return false
        }
      }

      return true
    })

    if (validCommands.length > 0) {
      validCommands.forEach(cmdConfig => {
        const command = cmdConfig.command

        if (typeof command === 'string' && command.trim() !== '') {
          const terminal = vscode.window.createTerminal()

          terminal.sendText(command)

          terminal.show()
        }
      })
    } else {
      console.log('Auto Run Command: No valid commands to run after checking conditions.')
    }
  } else {
    console.log('Auto Run Command: No commands to run.')
  }
}

// 显示提示用户配置扩展的通知

function showConfigurationNotification() {
  vscode.window

    .showInformationMessage(
      'Auto Run Commands: Configure commands to run automatically when opening projects',

      'Open Settings',
    )

    .then(selection => {
      if (selection === 'Open Settings') {
        vscode.commands.executeCommand('workbench.action.openSettings', 'autoRunCommands')
      }
    })
}

export function deactivate() {}
