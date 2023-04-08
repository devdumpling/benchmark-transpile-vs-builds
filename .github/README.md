# DevStack Monorepo Template Repo

For quick copy-pasta based on the setup I like (which I'm calling DevStack).

> Version 0.0.1

TODO:

- [ ] Setup CI/CD
- [ ] Setup testing 
- [x] Setup Nextra docs
- [ ] Setup build tooling
- [ ] Add script for init vercel deployments
- [ ] Add GHA metrics

## Stack

| Category      | Tools                   |
| ------------- | ----------------------- |
| Development   | NextJS/React/Typescript |
|               | TailwindCSS/PostCSS     |
| Documentation | Nextra                  |
| Testing       | Jest                    |
|               | React Testing Library   |
|               | Playwright              |
| Deployment    | Vercel                  |
| Tooling       | pnpm                    |
|               | turborepo               |
|               | Changesets              |
|               | GitHub Actions          |

## Structure

- `.changeset` - Changeset config
- `.github` - GitHub/GHA setup (also includes README, CONTRIBUTION, etc)
- `apps` - NextJS Apps
  - `web` - basic web app with tailwind, typescript, next latest
  - `docs` - Nextra docs app
- `packages` - reusable packages
  - `components`
  - `config`
  - `utils`
    - `js`
    - `react`
    - `next`
- `tools` - monorepo-specific custom tooling
