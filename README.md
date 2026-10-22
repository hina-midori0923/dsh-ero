# dsh-ero

A **semi-jailbreak writing plugin** for the official DeepSeek Harness (DSH 0.2.x).

`dsh-ero` is derived from [dsh-purge](https://github.com/hina-midori0923/dsh-purge). It keeps
the prompt-layer injection engine — the part that replaces the host's identity/refusal prose
with your own prompt — and deliberately drops everything else: no red-team console, no asset
store, no scanner/tunnel/webshell tooling, and no code-level patches for sandbox, approval,
hooks or filesystem policy.

Scope in one line: **break the literary/identity armor, not the host's security layer.**
It is built for adult fiction writing and character role-play; it is not an attack toolkit.

## What stays, what goes

| | |
|---|---|
| **Kept** | prompt injection (prompt-inject.md / rule sets), identity stripping, refusal-phrase cleanup, prompt editor via the config/CLI, retry-on-refusal, optional auto-continue, host patch status/apply/revert for the prompt-layer patches only |
| **Removed** | `lib/redteam` (drill console, asset store, tools, skills), red-team agent preset, scanner/tunnel tooling, network allowlist gate UI, hooks-deny bypass, all `CODE_PATCHES` / `ENGINE_PATCHES` / `NEW_TOOL_PATCHES` (sandbox, approval, fs, tool-policy) |
| **Added** | `dsh-ero/voice` — character-voice injection module (本子 / eroge 角色口吻), and a default writing prompt focused on adult fiction quality |

## Requirements

- DeepSeek Harness **0.2.x** (desktop `0.2.1-rc.2` tested, or official `dsh web`).
- Node.js **≥ 18** (the plugin's helpers use it).
- `$DSH_HOME` (usually `~/.dsh`).

## Install

```sh
# official desktop EXE
dsh plugin --profile desktop add github:hina-midori0923/dsh-ero

# official dsh web
dsh plugin --profile web add github:hina-midori0923/dsh-ero
```

Manual alternative: clone this repository to `$DSH_HOME/plugins/dsh-ero`, then add
`"dsh-ero": "file:../../plugins/dsh-ero"` to the profile's `dependencies` and `"dsh-ero"` to
`dsh.profile.bundles`, and run `pnpm install` inside that profile.

Tarball fallback:
`https://github.com/hina-midori0923/dsh-ero/archive/refs/heads/master.tar.gz`.

## Apply and edit the prompt

There is **no dock UI** in this plugin (the red-team console was removed with it). You drive it
through the prompt file and the agent tools:

1. Restart DSH after install.
2. Write your prompt to `$DSH_HOME/prompt-inject.md` (this survives updates and restores).
3. Apply the prompt-layer host patches once, either:
   - set `autoApplyOnStart: true` in the `dsh-ero` config of your profile's
     `cordis.patch.yml` and restart, or
   - run the CLI: `node "$DSH_HOME/plugins/dsh-ero/bin/dsh-ero.js" --status` / `--apply`,
   - or ask the agent to call the `ero_apply` tool.
4. Start a new chat — the inject applies to new sessions.

`ero_status` shows patch state, `ero_apply` applies, `ero_revert` restores from backups.
Patching is limited to the prompt-layer set; the security-layer patch ids are not in
`ALL_PATCHES` at all.

## Character voice module

`dsh-ero/voice` is a separate Cordis plugin entry. Configure it in the profile's
`cordis.patch.yml`:

```yaml
- id: dsh-ero-voice
  name: 'dsh-ero/voice'
  config:
    enabled: true
    preset: ero-heroine   # ero-heroine | tsundere | onee | yandere | kuudere | gyaru | custom | none
    custom: ""            # used when preset: custom
    order: 10300
```

Each preset injects a system-prompt section that tells the model to speak as that character —
first person, address forms, verbal tics, pacing, and onomatopoeia — while the main prompt keeps
the writing rules. Presets are plain strings in `lib/voice.js`; add your own there.

## Content policy

- Only **adults, consensual**, fictional scenarios.
- No minors, no real people (including public figures), no illegal-instruction content.
- The plugin does not remove DSH's security layer; it only changes the prose the model sees.

## Update

The built-in update check looks at this repository's tags (`lib/update.js` → `hina-midori0923/dsh-ero`).
Release flow: bump `version` → push `master` → push a `vX.Y.Z` tag.

## Uninstall

`node "$DSH_HOME/plugins/dsh-ero/bin/dsh-ero.js" --revert` restores the patched host files;
`--uninstall` removes the plugin from the profile and re-applies originals. `ero_revert` does the
same restore from an agent session.

## Credits and license

- Derived from **dsh-purge** by **YuJunZhiXue** (original repository deleted 2026-10-22, MIT).
- This fork: **hina-midori0923/dsh-ero**, MIT. Original copyright and license text are retained
  in [LICENSE](LICENSE).
- No affiliation with DeepSeek. "Official" above only means the official DSH package on your
  machine.
