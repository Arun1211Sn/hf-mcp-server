# Fork notes

Personal fork of [`huggingface/hf-mcp-server`](https://github.com/huggingface/hf-mcp-server)
(MIT). Goal: run it locally over **stdio** for Claude Code with **no hosted
restrictions** — full built-in tool set, `dynamic_space` access to *any* MCP-enabled
Gradio Space, and a pre-wired default Space list.

## Why fork instead of using the hosted endpoint
The hosted `huggingface.co/mcp` endpoint that Claude.ai connects to:
- passes `gradio=none` / a fixed bouquet, so arbitrary Spaces don't load
  (see `gradio="none"` sentinel, `tool-selection-strategy.ts:50`, `gradio-utils.ts:111`);
- enforces a server-side **"max number of spaces"** cap via the settings API
  (`error-messages.ts:11`).

Self-hosting in **local mode** (no `USER_CONFIG_API`) sidesteps both: built-in tools
come from `ALL_BUILTIN_TOOL_IDS` and Spaces come from our patched defaults — neither
touches the capped hosted settings API.

## Changes vs upstream
1. **`packages/app/src/shared/settings.ts`** — `DEFAULT_SPACE_TOOLS` expanded from the
   single upstream default (`mcp-tools/Z-Image-Turbo`) to three always-on Spaces:
   - `Lightricks/ltx-video-distilled` (gr1)
   - `mcp-tools/Z-Image-Turbo` (gr2)
   - `alexnasa/ltx-2-TURBO` (gr3)

   Add more by appending `{ _id, name, subdomain, emoji }` entries — `subdomain` is the
   value of the `subdomain` field from `https://huggingface.co/api/spaces/<owner/space>`.

2. **`run-stdio.sh`** — launcher: sources nvm (repo needs Node ≥22.13 / pnpm 11.5),
   loads `.env`, execs `packages/app/dist/server/stdio.js`.

3. **`.env.example`** — required env. Real secrets go in `.env` (gitignored).

## Build & run
```bash
nvm use 22 && corepack prepare pnpm@11.5.0 --activate
pnpm install && pnpm build
cp .env.example .env   # then paste your HF token
./run-stdio.sh         # stdio server for Claude Code
```

## Wire into Claude Code
Project `.mcp.json` (in the parent dir) points `hf-fork` at `run-stdio.sh`, or add
user-scoped:
```bash
claude mcp add hf-fork --scope user -- /home/arun/Documents/MCPs/hf-mcp-server/run-stdio.sh
```

## Staying current with upstream
```bash
git fetch upstream && git rebase upstream/main   # or merge
pnpm install && pnpm build
```
The only conflict-prone file is `settings.ts` (the `DEFAULT_SPACE_TOOLS` block).
