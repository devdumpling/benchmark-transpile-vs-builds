# Benchmarking Transpilation vs Building with Turbo

## Inspiration

So in my work one question that my team bounces back and forth on all the time is what is the best way to handle externalizing packages for a Next JS app in a monorepo that leverages turbo. 

Currently, we have a `packages` repo with a bunch of reusable components that are bundled with Babel. We then use turbo remote caching to ensure that we only actually build the packages that have changed. Our Next JS app then imports these packages from the `packages` repo and can use them with no further setup. 

This has worked well for us. Running app locally usually looks like a bunch of cache hits against turbo and then a few cache misses for the packages that have changed, as well as the app itself. But there's additional complexity here in that we have to have a separate build step for all of our packages. Lately, with all of the movement in bundlers it's not clear what the best way actually is to bundle. We use Babel because that's what we've been used to, but now with server components and many of the other necessities we have, it's not always the cleanest. 

The alternative to this approach is to use `transpileModules` and actually have the Next app itself transpile all of them at build time. At first glance this seems worse as we lose the benefits of turbo caching. Instead of a bunch of cache hits our app now has to transpile a bunch of packages to build each page. But Next has its own caching layer, as does webpack (and turbopack, when it's ready for prime time). That made me start to wonder... how bad is it actually? Could it be worth not having to deal with the building of individual packages?

## Limitations

This benchmark is only concerned with the above. It may not however be the end all be all, as there are legitimate reasons to build the packages outside of just running them in the app. For instance, publishing the packages to be consumed outside of the monorepo. 

Additionally, even within the monorepo we do have other software that uses the packages, e.g. Storybook and testing. Theoretically those should both be able to transpile without needing to build as well, but it since we have the turbo cache it should be saving time there. 

## Setup

This repo is forked from an example monorepo I have with many of the trimmings I like to use in production (pnpm, changesets, turborepo, next, typescript, tailwind, etc). You can find the full list below and the template repo at [dwells-monorepo-template](https://github.com/devdumpling/dwells-monorepo-template).

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
