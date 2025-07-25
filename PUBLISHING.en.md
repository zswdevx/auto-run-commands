# VS Code Extension Publishing Guide

This document details the steps to manually publish the "Auto Run Commands" extension to the VS Code Marketplace.

## Prerequisites

1. **Personal Access Token (PAT)**
   - Ensure you have obtained a Personal Access Token from the [VS Code Marketplace publishing page](https://marketplace.visualstudio.com/manage)
   - If not, follow the [official documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) to create one

2. **Publisher Account**
   - Ensure you have registered a publisher account on VS Code Marketplace
   - Current publisher ID: `zswdevx`

## Publishing Steps

### 1. Prepare for Publishing

1. **Ensure Code Quality**
   ```bash
   # Run all checks, including linting, format checking, compilation, and packaging
   pnpm run prepublish-checks
   ```

2. **Update Version Number**
   ```bash
   # Update patch version (0.0.1 -> 0.0.2)
   pnpm run version:patch

   # Or update minor version (0.0.1 -> 0.1.0)
   pnpm run version:minor

   # Or update major version (0.0.1 -> 1.0.0)
   pnpm run version:major
   ```
   This will automatically:
   - Update the version number in package.json
   - Update the version and date in CHANGELOG.md

3. **Verify CHANGELOG.md**
   - Check that CHANGELOG.md correctly reflects all changes
   - Edit manually if needed to add more details

### 2. Publish to VS Code Marketplace

1. **Login and Publish**
   ```bash
   # If it's your first time, you need to login first
   pnpm dlx vsce login zswdevx

   # Publish the extension
   pnpm run publish
   ```
   Alternatively, you can use your PAT directly:
   ```bash
   pnpm dlx vsce publish -p <your-pat-here>
   ```

2. **Verify Publication**
   - Visit [your publisher page](https://marketplace.visualstudio.com/publishers/zswdevx)
   - Confirm the new version has been successfully published

### 3. Create Git Tag and Commit

1. **Commit Version Changes**
   ```bash
   git add .
   git commit -m "release: version x.y.z"
   ```

2. **Create Git Tag**
   ```bash
   git tag v{x.y.z}  # e.g., v0.1.0
   ```

3. **Push Changes and Tags**
   ```bash
   git push && git push --tags
   ```

## Common Issues and Solutions

### Publishing Failures

- **Issue**: `The Personal Access Token is incorrect or has expired`
  - **Solution**: Update your PAT, ensuring it has the correct permissions

- **Issue**: `Extension with id 'auto-run-commands' is already published`
  - **Solution**: Make sure you've updated the version in package.json

### Version Management

- **Development Versions**: Use the `-dev` suffix (e.g., `0.0.1-dev`)
- **Pre-release Versions**: Use `-alpha`, `-beta`, or `-rc` suffixes
  ```bash
  # Create a pre-release version
  pnpm run version:prerelease
  ```

## References

- [VS Code Official Documentation on Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce Tool Documentation](https://github.com/microsoft/vscode-vsce)
- [Semantic Versioning](https://semver.org/)
