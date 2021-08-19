---
title: Publish TypeScript module declarations and bundling with rollup
date: 2018-09-09
tags: ['typescript', 'npm', 'rollup']
thumbnail: typescript.png
thumbnailBg: '#007ACC'
---

It seems there's some tightly guarded industry secrets around publishing TypeScript module declarations effectively. Let's break it down.

<!--more-->

Here I was, one day, coding away on a shared internal module for our npm registry when I realized that, despite having used modules with TypeScript declarations, I had never written any on my own.

All it all it ends up being relatively simple. There's just a of nuance for slightly complicated setups. This could also apply to any bundler (webpack, parcel, or rollup). I've just picked rollup.

[Example project can be found here](https://github.com/deldreth/blog-es-ts-module-1)

## tsconfig

Firstly, structure your tsconfig like you're shipping a package that you as an affluent TypeScript developer would use.

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "outDir": "dist",
    "lib": ["es2015"]
  }
}
```

I generally continue to target es5 for my modules. Your use case may vary. The `declaration` setting here instructs the compiler to emit declarations to your outDir. There are other compiler options that can come in handy for more complicated setups.

```
declarationDir - Specify directory for declarations
declarationMap - Source maps
emitDeclarationOnly
```

### Running tsc on some sample modules

I've outlined a very basic module that we're going to ship. The default export of Module1 is a class that has as single method `request` which returns a Response type interface.

```typescript
// src/Module1.ts defines an interface and a simple class:
export interface Response {
  loading: boolean;
  error: boolean;
}

export default class ModuleOne {
  request(): Response {
    return {
      loading: true,
      error: false,
    };
  }
}
```

```typescript
// src/index.ts imports the module and creates an instance
import Module1, { Response } from './Module1';

export function test(): Response {
  const foo = new Module1();

  return foo.request();
}
```

Simple, but we've outlined enough to setup our modules. If we run the compiler against these files with our config above we're given four files. Two are es5 modules and the other two are declarations (`*.d.ts`).

## Inform npm of your es module

This package.json configuration can be used reguardless of whether you're shiping es modules or not. Inform npm the of default module for your package by adding the `"module": "<dir>"` key value pair. It's quite literally defined as:

> An ECMAScript module ID that is the primary entry point of your program

```json
{
  "name": "es-ts-module-1",
  "version": "1.0.0",
  "author": "Devin Eldreth",
  "license": "MIT",
  "main": "dist/ex-ts-module-one.cjs.js",
  "module": "dist/index.js",
  "devDependencies": {
    "rollup": "^0.66.0",
    "typescript": "^3.0.3"
  }
}
```

> Tools like rollup will inspect the package.json files of dependencies and use the ECMAScript module.

## Bundling with rollup

Here I've gone with commonjs bundle to keep this rollup config simple.

```typescript
// rollup.config.js
import pkg from './package.json';

export default {
  input: 'dist/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
};
```

Notice that I'm importing package.json and specifically reference a field. I've updated the main field to be the location of the bundle. We're also not using any plugins with rollup so everything is bundled from our TypeScript compiled JavaScript.

```json
{
  "name": "es-ts-module-1",
  "version": "1.0.0",
  "author": "Devin Eldreth",
  "license": "MIT",
  "main": "dist/ex-ts-module-one.cjs.js",
  "module": "dist/index.js",
  "devDependencies": {
    "rollup": "^0.66.0",
    "typescript": "^3.0.3"
  }
}
```

This field is most common and behaves much like our `module` setting above. The distinction is that this is the true module ID of your package. My default npm and other tools will look at this field to determine the contents of the package.

### Two simple scripts to wrap everything up

I've added two short scripts to the package.json to faciliate compiling and bundling.

```json
// package.json
{
  "name": "es-ts-module-1",
  "version": "1.0.0",
  "author": "Devin Eldreth",
  "license": "MIT",
  "main": "dist/ex-ts-module-one.cjs.js",
  "module": "dist/index.js",
  "devDependencies": {
    "rollup": "^0.66.0",
    "typescript": "^3.0.3"
  },
  "scripts": {
    "compile": "tsc",
    "postcompile": "rollup -c"
  }
}
```

Compile then rollup. Yay!

## Another variation (shipping TypeScript modules directly)

The TypeScript compiler will resolve module dependencies too. If you're living in a world where you know that your module will be consumed as TypeScript you can set `"module": "src/index.ts"`. In this situation you wouldn't even need to worry about compiling or bundling (just make sure you set your peerDependencies relative to the version of TypeScript you're compilation needs).

## Ship type declarations without worrying about modules

TypeScript will also look for two package.json fields when resolving dependencies: `types` and `typings`. If you're in a situation where you just need to ship types you could easily specify the emit declaration directory in your tsconfig, set either of those fields and update the `files` field in your package.json. This way anyone consuming your module with TypeScript will be able to utilize your types.

## Caveats

It's probably important to note that "module" within package.json is a proposal. Outside of the the drafts for its documentation the main npm docs don't make mention of it. It's used fairly regularly though so there's a good chance it or something similar will make it into a future release (rollup and TypeScript as examples that resolve it).

This setup does **not** handle the situation where tests exist alongside your source. Specifically if your tests are also in TypeScript. As is this project would ship declarations for those tests. Not really ideal for most situations. `tsc` can accept specific config files so for more complicated setups you will probably find it useful to break your project out into multiple tsconfigs.

## Takeaway

The TypeScript compiler gives you a powerful set of tools to make the distribution and consumption of your module and its types simpler. We can use the compiled JavaScript to bypass more complicated bundler setups.

1. Configure tsconfig to emit declarations.
2. Update package.json's module field to be your es module entry point.
3. Bundle your module if need be.
4. Update package.json's main field to be your module entry point.
