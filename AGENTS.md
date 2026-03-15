# Workspace Instructions

- Repository layout: this is a GitHub Pages repository where each top-level folder is a separate static application with its own `index.html` and related web assets.
- New projects: create a new top-level folder for each new app and use a URL-safe lowercase kebab-case name made from letters, digits, and hyphens only.
- Always use WSL for shell commands in this repository when possible.
- Only fall back to native PowerShell when a task is explicitly Windows-specific or WSL is not available.
- Local preview workflow: keep and use the root-level npm tooling for static previews. After Node.js and npm are available, run `npm install` in the repo root, then start a project with `npm run serve -- <project-folder>`.
- Preview behavior: the serve script runs `http-server` from the repo root and automatically opens the requested project in a browser at `http://127.0.0.1:<port>/<project-folder>/`.
- App structure expectation: each project folder should keep its main entry file at `<project-folder>/index.html`.
- Root index maintenance: when a new game/app folder is created, also add its full GitHub Pages link to the root `index.html` list so the homepage stays in sync.
- Publish pairing: when a new game/app is being committed and pushed for publication, include the matching `index.html` update in the same commit/push.
- Git behavior: do not commit or push unless the user explicitly asks to commit and push.
