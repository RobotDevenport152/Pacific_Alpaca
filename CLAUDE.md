# Claude Code Rules

## GitHub Deployment

**Remote:** https://github.com/RobotDevenport152/Pacific_Alpaca.git

### Deployment Rules

1. **Always confirm before pushing.** Never push to the remote repository unless the user explicitly asks (e.g., "push", "deploy", "publish").

2. **Default branch is `main`.** All deployments target the `main` branch unless the user specifies otherwise.

3. **Commit before push.** Always ensure changes are committed with a clear message before pushing. Never push uncommitted changes.

4. **No force pushes to main.** Never run `git push --force` on the `main` branch. Warn the user if they request it.

5. **No skipping hooks.** Never use `--no-verify` unless the user explicitly requests it.

6. **Deployment steps (in order):**
   1. Stage specific files (avoid `git add -A` for sensitive projects)
   2. Commit with a descriptive message
   3. Push to `origin main`
   4. Confirm success by checking `git status` and `git log`

### Commit Message Format

```
<type>: <short description>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

### Example Deploy Command

```bash
git add <files>
git commit -m "feat: your message here"
git push origin main
```
