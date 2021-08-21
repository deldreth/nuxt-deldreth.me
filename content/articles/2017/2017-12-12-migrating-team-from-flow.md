---
title: Migrating my team from flow to TypeScript
date: 2017-12-12
tags: ['typescript', 'flow', 'react']
thumbnail: typescript.png
thumbnailBg: '#007ACC'
published: true
---

After approximately 2 years of working with flow and its frustrations I decided it was time to move fully into TypeScript.

<!--more-->

Before you get `#triggered` I'm not at all bashing flow. If you're living in a world where running type checks at build time works for you then awesome. Personally, over the months leading up to the decision, I've encountered a few problems with flow.

1. **Predictability**: 7/10 times I can't actually tell that flow is behaving as I would expect. In some situations the flow subprocess has died silently (multiple times).

2. **Community**: The statically-type-your-javascript community has largely adopted TypeScript and with the maintenance of @types through [DefinitelyTyped](http://definitelytyped.org/) there's type definitions for _hundreds_ of third party packages. Obviously some packages ship with flow definitions but this seems an exception.

## Prepping for TypeScript

We maintain a private npm registry and a specific repository that houses a pool of React components and associated flow types. This particular repository has been the biggest source of contention with the migration.
