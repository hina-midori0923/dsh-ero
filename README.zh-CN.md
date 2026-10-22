# dsh-ero

DeepSeek Harness（DSH 0.2.x）的**半破甲写作插件**。

`dsh-ero` 从 [dsh-purge](https://github.com/hina-midori0923/dsh-purge) 派生：保留提示词注入引擎
（把宿主自带的身份段、拒答措辞替换成你自己的提示词这一层），其余全部剥离——没有演练台、
没有资产库、没有扫描/隧道/WebShell 工具，也不再打沙箱、审批、hooks、文件系统策略这些
代码级补丁。

一句话定位：**只拆文学 / 身份甲，不拆宿主安全层。** 面向成年向虚构写作与角色扮演，不是
攻击工具箱。

## 保留 / 移除 / 新增

| | |
|---|---|
| **保留** | 提示词注入（prompt-inject.md / 规则集）、官方身份清理、拒答措辞清理、提示词编辑（配置文件 / CLI）、拒答重试、可选自动续写、仅提示词层补丁的状态/应用/恢复 |
| **移除** | `lib/redteam`（演练台、资产库、工具、技能）、红队预设、扫描/隧道工具、网络白名单闸、hooks deny 绕过、全部 `CODE_PATCHES` / `ENGINE_PATCHES` / `NEW_TOOL_PATCHES`（沙箱、审批、fs、工具策略） |
| **新增** | `dsh-ero/voice` —— 角色口吻注入模块（本子 / eroge 角色说话方式），以及面向成人向小说质量的默认写作提示词 |

## 环境要求

- DeepSeek Harness **0.2.x**（桌面端 `0.2.1-rc.2` 已验证，或官方 `dsh web`）。
- Node.js **≥ 18**（插件辅助脚本用）。
- `$DSH_HOME`（一般是 `~/.dsh`）。

## 安装

```sh
# 官方桌面端 EXE
dsh plugin --profile desktop add github:hina-midori0923/dsh-ero

# 官方 dsh web
dsh plugin --profile web add github:hina-midori0923/dsh-ero
```

手动安装：把本仓库克隆到 `$DSH_HOME/plugins/dsh-ero`，在 profile 的 `dependencies` 里加
`"dsh-ero": "file:../../plugins/dsh-ero"`、`dsh.profile.bundles` 里加 `"dsh-ero"`，再在该
profile 目录里跑 `pnpm install`。

GitHub 拉取不稳时用 tarball：
`https://github.com/hina-midori0923/dsh-ero/archive/refs/heads/master.tar.gz`。

## 应用与编辑提示词

本插件**没有停靠栏 UI**（随红队控制台一起移除了），走提示词文件 + agent 工具：

1. 安装后重启 DSH。
2. 把你的提示词写进 `$DSH_HOME/prompt-inject.md`（更新、恢复都不会动它）。
3. 应用一次提示词层补丁，三选一：
   - 在 profile 的 `cordis.patch.yml` 里给 `dsh-ero` 配置打开 `autoApplyOnStart: true`，重启；
   - 跑 CLI：`node "$DSH_HOME/plugins/dsh-ero/bin/dsh-ero.js" --status` / `--apply`；
   - 让 agent 调 `ero_apply` 工具。
4. 新开一轮对话 —— 注入对新的会话生效。

`ero_status` 看补丁状态，`ero_apply` 应用，`ero_revert` 从备份恢复。补丁集合只含提示词层，
安全层补丁 id 根本不进 `ALL_PATCHES`。

## 角色口吻模块

`dsh-ero/voice` 是独立的 Cordis 插件条目，在 profile 的 `cordis.patch.yml` 里配置：

```yaml
- id: dsh-ero-voice
  name: 'dsh-ero/voice'
  config:
    enabled: true
    preset: ero-heroine   # ero-heroine | tsundere | onee | yandere | kuudere | gyaru | custom | none
    custom: ""            # preset: custom 时使用
    order: 10300
```

每个 preset 会注入一段系统提示词：第一人称、称呼、语气词、节奏、拟声，让模型按角色口吻说话；
主插件提示词继续负责写作规则。预设就是 `lib/voice.js` 里的纯文本，可以自己加。

## 内容边界

- 只写**成年人之间、自愿**的虚构场景。
- 不写未成年、不写真实人物（含公众人物）、不写以伤害为目的的违法教程。
- 插件不碰 DSH 的安全层，只改模型看到的文字。

## 更新

插件自带的检查更新看本仓库 tag（`lib/update.js` → `hina-midori0923/dsh-ero`）。
发版流程：改 `version` → push `master` → 推 `vX.Y.Z` tag。

## 卸载

`node "$DSH_HOME/plugins/dsh-ero/bin/dsh-ero.js" --revert` 从备份还原宿主文件；
`--uninstall` 把插件移出 profile 并重新应用原件。会话里也可以用 `ero_revert`。

## 来源与许可

- 派生自 **dsh-purge**，原作者 **YuJunZhiXue**（原仓库 2026-10-22 已删除，MIT）。
- 本分支：**hina-midori0923/dsh-ero**，MIT。原版权声明与许可全文保留在
  [LICENSE](LICENSE)。
- 与 DeepSeek 无隶属关系；上文「官方」仅指你本机安装的官方 DSH 包。
