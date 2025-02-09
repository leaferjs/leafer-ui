# Git Commit Message Convention

> This is adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

### Pull Request

1. fork 代码
2. 创建自己的分支: git checkout -b feat/xxxx
3. 提交你的修改: git commit -am 'feat(type): add xxxxx'
4. 推送您的分支: git push origin feat/xxxx
5. 提交 pull request
6. 首次提交需同意 [贡献者许可协议](https://cla-assistant.io/leaferjs/leafer-ui)， 我们才能合并的了代码

### 常用提交类型

- feat: 增加新功能
- fix: 修复问题/BUG
- perf: 优化/性能提升
- refactor: 重构
- revert: 撤销修改
- test: 测试相关
- docs: 文档/注释
- chore: 依赖更新/脚手架配置修改等
- workflow: 工作流改进
- ci: 持续集成
- types: 类型定义文件更改
- style: 代码风格相关无影响运行结果的

#### Examples

Appears under "Features" header, `drag` subheader:

```
feat(drag): add 'hover' option
```

Appears under "Bug Fixes" header, `editor` subheader, with a link to issue #16:

```

fix(editor): handle events on select

close #16

```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```

perf(core): improve vdom diffing by removing 'foo' option

BREAKING CHANGE: The 'foo' option has been removed.

```

The following commit and commit `667ecc1` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```

revert: feat(drag): add 'hover' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.

```

### Full Message Format

A commit message consists of a **header**, **body** and **footer**. The header has a **type**, **scope** and **subject**:

```

<type>(<scope>): <subject>
<BLANK LINE>

<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body, it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However, if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

### Scope

The scope could be anything specifying the place of the commit change. For example `core`, `event`, `animation`, `editor`, `transition` etc...

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.
