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

let outputChannel: vscode.OutputChannel
function log(message: string) {
  if (outputChannel) {
    const timestamp = new Date().toLocaleTimeString()
    outputChannel.appendLine(`[${timestamp}] ${message}`)
  }
}

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Auto Run Commands for NPM Projects')
  context.subscriptions.push(outputChannel)

  log('Extension activated')

  const configureCommand = vscode.commands.registerCommand(
    'autoRunCommands.configureCommands',
    () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'autoRunCommands')
    },
  )

  const showLogsCommand = vscode.commands.registerCommand('autoRunCommands.showLogs', () => {
    outputChannel.show()
  })

  context.subscriptions.push(configureCommand, showLogsCommand)

  const hasShownNotification = context.globalState.get('autoRunCommands.hasShownNotification')
  if (!hasShownNotification) {
    showConfigurationNotification()
    context.globalState.update('autoRunCommands.hasShownNotification', true)
  }
  const config = vscode.workspace.getConfiguration('autoRunCommands')
  const simpleConfigInfo = config.inspect<string[]>('commands')
  const configInfo = config.inspect<CommandConfig[]>('commandsWithConditions')
  let commandsToRun: CommandConfig[] = []

  if (configInfo?.workspaceValue !== undefined) {
    log('Found commands with conditions in workspace settings.')
    commandsToRun = configInfo.workspaceValue
  } else if (configInfo?.globalValue !== undefined) {
    log('Found commands with conditions in global user settings.')
    commandsToRun = configInfo.globalValue
  } else if (simpleConfigInfo?.workspaceValue !== undefined) {
    log('Found simple commands in workspace settings.')
    commandsToRun = simpleConfigInfo.workspaceValue.map(cmd => ({ command: cmd }))
  } else if (simpleConfigInfo?.globalValue !== undefined) {
    log('Found simple commands in global user settings.')
    commandsToRun = simpleConfigInfo.globalValue.map(cmd => ({ command: cmd }))
  }

  if (commandsToRun.length > 0) {
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders) {
      log('No workspace folder found.')
      return
    }
    const rootPath = workspaceFolders[0].uri.fsPath
    const validCommands = commandsToRun.filter(cmdConfig => {
      if (!cmdConfig.condition) {
        return true // 没有条件的命令始终执行
      }
      if (cmdConfig.condition.fileExists) {
        const filePath = path.join(rootPath, cmdConfig.condition.fileExists)
        if (!fs.existsSync(filePath)) {
          log(
            `Skipping command "${cmdConfig.command}" - required file not found: ${cmdConfig.condition.fileExists}`,
          )
          return false
        }
      }
      if (cmdConfig.condition.packageScript) {
        const packageJsonPath = path.join(rootPath, 'package.json')
        if (!fs.existsSync(packageJsonPath)) {
          log(`Skipping command "${cmdConfig.command}" - package.json not found`)
          return false
        }
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
          if (!packageJson.scripts || !packageJson.scripts[cmdConfig.condition.packageScript]) {
            log(
              `Skipping command "${cmdConfig.command}" - script not found: ${cmdConfig.condition.packageScript}`,
            )
            return false
          }
        } catch (error) {
          log(`Error parsing package.json: ${error}`)
          return false
        }
      }
      return true
    })
    if (validCommands.length > 0) {
      log(`Running ${validCommands.length} command(s)`)
      validCommands.forEach(cmdConfig => {
        const command = cmdConfig.command
        if (typeof command === 'string' && command.trim() !== '') {
          log(`Executing command: ${command}`)
          const terminal = vscode.window.createTerminal()
          terminal.sendText(command)
          terminal.show()
        }
      })
    } else {
      log('No valid commands to run after checking conditions.')
    }
  } else {
    log('No commands to run.')
  }
}
function showConfigurationNotification() {
  vscode.window
    .showInformationMessage(
      'Auto Run Commands for NPM Projects: Configure commands to run automatically when opening projects',
      'Open Settings',
      'Show Logs',
    )
    .then(selection => {
      if (selection === 'Open Settings') {
        vscode.commands.executeCommand('workbench.action.openSettings', 'autoRunCommands')
      } else if (selection === 'Show Logs') {
        outputChannel.show()
      }
    })
}
export function deactivate() {
  if (outputChannel) {
    log('Extension deactivated')
    outputChannel.dispose()
  }
}
