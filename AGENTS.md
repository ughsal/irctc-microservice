# Repository Guidelines

## Project Structure & Module Organization
This repository currently has no tracked source files or build configuration. When code is added, keep the layout predictable:

- `src/` for application code
- `tests/` or `__tests__/` for automated tests
- `public/` for static assets
- `docs/` for reference material or runbooks

Use small, focused modules. Prefer feature-based folders when a domain grows beyond a few files.

## Build, Test, and Development Commands
No build or test scripts are defined yet. Once a `package.json`, Makefile, or equivalent is added, document the canonical commands here and keep them in sync with the project scripts. Typical examples:

- `npm install` to install dependencies
- `npm test` to run the test suite
- `npm run build` to produce a production build
- `npm run dev` to start a local development server

## Coding Style & Naming Conventions
Use the language and formatter chosen by the project once established, and keep formatting consistent across the repo. Until then:

- Prefer ASCII filenames and identifiers unless a domain term requires otherwise
- Use `camelCase` for variables and functions, `PascalCase` for classes and components, and `kebab-case` for filenames when appropriate
- Keep indentation consistent within each file type
- Add brief comments only where intent is not obvious

## Testing Guidelines
Add tests alongside the code they cover or under a dedicated test directory. Name tests after the unit or behavior they verify, for example `auth.service.test.ts` or `login-flow.spec.ts`. Keep tests deterministic and avoid external dependencies unless they are explicitly mocked.

## Commit & Pull Request Guidelines
There is no Git history in this workspace to derive a commit convention from. Use clear, imperative commit messages such as `Add login form validation`. For pull requests:

- Describe what changed and why
- Link related issues or tasks
- Include screenshots or logs when UI or behavior changes are involved
- Note any setup steps or migration impacts

## Agent-Specific Instructions
Before editing, check whether a file already exists and avoid overwriting user work. Keep changes minimal, explain any assumptions, and update this guide if the repository gains a real build, test, or lint workflow.
