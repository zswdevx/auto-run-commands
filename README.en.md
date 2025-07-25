[Read this in Chinese (简体中文)](./README.md)

# Auto Run Command

This VS Code extension automatically runs predefined commands in the integrated terminal whenever you open a workspace. It's perfect for starting development servers, running build watchers, or any other repetitive setup task.

## Features

- **Automatic Execution**: Runs your setup commands the moment you open a project.
- **Flexible Configuration**: Set commands globally for all projects or define specific commands for each workspace.
- **Workspace Override**: Workspace-specific commands always take precedence over global settings.
- **Multiple Terminals**: Each command is executed in its own dedicated integrated terminal.
- **Smart Conditional Execution**: Set conditions so commands only run when specific criteria are met (like when certain files exist or when package.json contains specific scripts).

## How It Works

The extension reads its configuration from VS Code's settings. It uses a hierarchical approach:

1.  **Workspace Settings**: It first looks for commands in the project-specific `.vscode/settings.json` file. If found, these commands are executed.
2.  **Global User Settings**: If no workspace-specific commands are defined, it falls back to the global `settings.json` file.
3.  **No Commands**: If no commands are found in either location, it does nothing.

**Important**: Commands are executed in parallel, each in its own terminal. This is ideal for starting independent services (like a frontend and a backend server), but not for commands that depend on each other (like `npm install` followed by `npm run build`).

This allows you to set default commands for all your projects (like `git pull`) and override them with project-specific needs (like `npm run dev`).

## Usage

### Setting Workspace-Specific Commands

This is the most common use case. For a specific project, you want to run commands like `npm install` and `npm run dev`.

1.  In your project, create or open the `.vscode/settings.json` file.
2.  Add your commands to the `autoRunCommands.commands` array:

    ```json
    {
      "autoRunCommands.commands": [
        "cd client && npm run dev",
        "cd server && npm run start"
      ]
    }
    ```

3.  The next time you open this project, these commands will run automatically.

### Setting Global Default Commands

If you have commands you want to run for *every* project (that doesn't have its own workspace configuration).

1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2.  Search for and select **"Preferences: Open User Settings (JSON)"**.
3.  Add your global commands:

    ```json
    {
      // ...your other global settings
      "autoRunCommands.commands": [
        "git pull --rebase",
        "echo 'Welcome to your project!'"
      ]
    }
    ```

### Disabling Commands for a Specific Workspace

If you have global commands set but want to prevent any commands from running in a particular workspace, simply define an empty array in the workspace settings.

1.  Open `.vscode/settings.json` for that project.
2.  Add the following configuration:

    ```json
    {
      "autoRunCommands.commands": []
    }
    ```

This will override the global settings and result in no commands being executed.

### Using Conditional Commands

To prevent certain commands from running in projects where they don't apply (e.g., running `npm run dev` in a non-frontend project), you can use conditional commands:

1. Open `.vscode/settings.json` (for workspace-specific settings) or your global settings.
2. Use the `autoRunCommands.commandsWithConditions` configuration:

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

In the example above:
- The first command `npm run dev` will only run when a "dev" script exists in package.json.
- The second command `pnpm build` will only run when both conditions are met: pnpm-lock.yaml file exists and a "build" script is present in package.json.

Available condition types:

- `fileExists`: Checks if a specified file exists (relative to workspace root)
- `packageScript`: Checks if a specific script exists in package.json

This ensures commands only run in applicable projects, avoiding unnecessary errors and confusion.

---

Enjoy a more productive workflow!