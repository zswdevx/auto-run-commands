# Changelog

All notable changes to the "Auto Run Commands for NPM Projects" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.2] - 2025-08-11

### Added
- Added logging functionality with output channel for viewing extension status in VS Code
- New "Show Auto Run Commands Logs" command for quick access to log panel
- Smart terminal detection to prevent duplicate command execution on window reload
- Unique terminal naming for auto-run commands (Auto Run: command...)

### Changed
- Renamed legacyConfigInfo to simpleConfigInfo for better semantic clarity
- Optimized code structure by removing unnecessary blank lines
- Enhanced first-time installation notification with "Show Logs" button

### Fixed
- Resolved issue with duplicate command execution when reloading window
- Improved terminal management to avoid creating duplicate terminal instances

## [0.0.1] - 2025-07-25
- Smart conditional execution feature, allowing commands to run only when specific files exist or package.json scripts are present
- First-time installation guidance notification
- Quick access to settings via command palette
- Improved command execution logic with clearer status reporting

## [0.0.1-dev] - 2025-07-25
- Initial development version
- Implemented basic functionality to automatically run predefined commands when a workspace opens

### Added
- Initial release
- Support for automatically running predefined commands when a workspace opens
- Support for workspace-specific settings and global defaults
- Each command runs in its own dedicated terminal
