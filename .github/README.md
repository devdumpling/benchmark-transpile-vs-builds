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

### Let's Make Some Packages

I initialized an example component that builds... which opens up an interesting question. What the heck do we build with? Next starters all currently use `tsup`, which is a fine lean approach. Only problem is `tsup` support for css is experimental and to my knowledge it doesn't support directives (which we'll need for client components a la `use client`).

I decided to look at a few options.

The obvious first choice is `SWC` (speedy web compiler), since that's what Next uses already. This should be the closest approximation to `transpileModules`. However, it's not clear to me that swc actually works with css either, though I do believe it supports directives. As such, I'm turning my attention to another project I've wanted to try for a while: [Parcel](https://parceljs.org/getting-started/library/).

Parcel is built on SWC, so should be a closer comparison than going all the way to Vite or something. It has a ton of support beyond just SWC, so might work a little cleaner for this. I'll go back and try with just SWC at some point as well, but for the initial setup we're going to go the parcel route.

### Parcel Setup

We simply follow the parcel library setup guide, adding it as a dev dep to our example component package and then a couple of quick lines to `packagse/components/example/package.json`:

```json
// package.json
...
"source": "src/index.tsx",
"main": "./dist/index.js",
...
```

We'll also need some scripts for building and watching.

```json
// package.json
"scripts": {
    "watch": "parcel watch",
    "build": "parcel build"
  },
```

Okay that should get us going!

### Debuggin Parcel Monorepo Setup

Alright, so after some digging I discovered that there have been _some_ issues in the past with using Parcel in a monorepo. It appears that it actually does quite a bit of heavy lifting on its own when it comes to tailwind/postcss--it even has its own PostCSS parser built in rust that is uh, pretty damn fast. Further it appears to do some amount of caching, further speeding things up.

That's all cool, but I had issues running it from a workspace. It seems like the dependencies have to be in the root (annoying) or you can use globs to specify what you're building. Putting the build deps in the root felt cleaner, so I went with that option for now.

[There was a post around Parcel not working with Turbo](https://github.com/parcel-bundler/parcel/issues/8777), but I didn't find that to be the case so far. Will continue to investigate and see if I have any issues though. I am a bit nervous around having both a turbo cache _and_ a parcel cache. That feels like a disaster waiting to happen, but let's see how it goes.

### Problems

After some tweaking I was able to get the Parcel setup working in a package. For unclear reasons, `parcel watch` breaks everything, so I'm going to not run that for now. But I can make changes and build and everything works smoothly there. Next question is can I get HMR working across the repo... so far no luck but let's dig in a bit.

Alright so if I turn off parcel cache cross package HMR does sort of work... but not really. While it does compile, the app doesn't seem to pick up on the new classes (e.g. if I changed from `text-red-500` to `text-violet-500` and my app doesn't have a definition (i.e. it was purged) for the violet, then it won't render as expected).

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
