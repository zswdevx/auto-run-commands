/* eslint-disable @typescript-eslint/no-require-imports */
// 更新CHANGELOG.md中的版本号和发布日期
const fs = require('fs')
const path = require('path')

// 读取package.json获取版本号
const packageJsonPath = path.join(__dirname, '../package.json')
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const { version } = packageData

// 获取当前日期，格式为YYYY-MM-DD
const today = new Date().toISOString().split('T')[0]

// 更新中文版CHANGELOG
updateChangelog('CHANGELOG.md', version, today)
// 更新英文版CHANGELOG
updateChangelog('CHANGELOG.en.md', version, today)

function updateChangelog(filename, version, date) {
  const changelogPath = path.join(__dirname, '..', filename)

  if (!fs.existsSync(changelogPath)) {
    console.error(`File not found: ${changelogPath}`)
    return
  }

  let content = fs.readFileSync(changelogPath, 'utf8')

  // 替换未发布版本标题并插入新版本条目
  if (filename.includes('.en.')) {
    // 英文版 CHANGELOG
    // 将 [Unreleased] 后面的内容提取并移动到新版本下
    const unreleasedPattern = /## \[Unreleased\]([\s\S]*?)(?=\n## \[|$)/i
    const unreleasedMatch = content.match(unreleasedPattern)

    if (unreleasedMatch && unreleasedMatch[1].trim()) {
      const unreleasedContent = unreleasedMatch[1].trim()
      content = content.replace(
        unreleasedPattern,
        `## [Unreleased]\n\n## [${version}] - ${date}\n${unreleasedContent}`,
      )
    } else {
      // 如果没有内容，只插入新的版本标题
      content = content.replace(
        /## \[Unreleased\]/i,
        `## [Unreleased]\n\n## [${version}] - ${date}`,
      )
    }
  } else {
    // 中文版 CHANGELOG
    // 将 [未发布] 后面的内容提取并移动到新版本下
    const unreleasedPattern = /## \[未发布\]([\s\S]*?)(?=\n## \[|$)/i
    const unreleasedMatch = content.match(unreleasedPattern)

    if (unreleasedMatch && unreleasedMatch[1].trim()) {
      const unreleasedContent = unreleasedMatch[1].trim()
      content = content.replace(
        unreleasedPattern,
        `## [未发布]\n\n## [${version}] - ${date}\n${unreleasedContent}`,
      )
    } else {
      // 如果没有内容，只插入新的版本标题
      content = content.replace(/## \[未发布\]/i, `## [未发布]\n\n## [${version}] - ${date}`)
    }
  }

  fs.writeFileSync(changelogPath, content, 'utf8')
  console.log(`Updated ${filename} to version ${version} (${date})`)
}

console.log(`Version updated to ${version}`)
