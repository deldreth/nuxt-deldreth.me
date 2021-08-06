---
title: Managing redux side effects with async await
date: 2016-12-08
tags: ['react', 'redux', 'testing']
---

Sagas are great. However, they come with an extensive and somewhat complicated api and they require functional knowledge of generators. Here I revist my react-boilerplate repo refactored with async/await side effect management.

<!--more-->

The [effects branch](https://github.com/deldreth/react-boilerplate/tree/effects)
contains the changes detailed in this post.

### The Basics

With redux-saga we're ultimately using a promise like approach for side effect
management. It comes with a series of functions that describe to the saga
middleware the expectation of the yields.

With the async/await approach we avoid the complications of using generators
and rely soley on ES2017 async modifiers. The project now has a dependency
of [redux-effex](https://github.com/exponent/redux-effex) which provides some utilities for setting up the async
functions (nothing quite as complicated as sagas).

### Our First Async Side Effect

The most basic side effect of the boilerplate app is expecting the app to
load. Previously with redux sagas that generator looked like this:

```javascript
export function* watchAppLoaded() {
  while (true) {
    yield take(Types.LOADED);

    yield put(Actions.fetchPosts());
  }
}
```

We eventually `fork` the saga as part of the export.

With redux-effex and async functions we can rework this side effect as:

```javascript
import type { EffectParams } from 'redux-effex';

async function loadedAync({ action, dispatch, getState }: EffectParams) {
  dispatch(Actions.fetchPosts());
}

export default [
  {
    action: Types.LOADED,
    effect: loadedAync,
    error: errorHandler,
  },
];
```

We've defined an async function `loadedAsync` that performs the same dispatch
as the saga. Note the added destructing syntax of the function signature.

I'm not going to go into detail about the export syntax for redux-effex. It's
documented well enough.

### Awaiting for Async Responses

With redux-saga we have to _yield_ to the call saga method for our API calls.
With redux-effex we can simply define an expression as await. The previous
example dispatched the FETCH_POSTS action. Here is the async function for handling
the side effects.

```javascript
async function fetchPostsAsync({ actions, dispatch, getState }: EffectParams) {
  const response = await Api.getPosts();

  if (response.ok) {
    dispatch(Actions.receivePosts(response.data));
  } else {
    // Some error
  }
}

export default [
  {
    action: Types.FETCH_POSTS,
    effect: fetchPostsAsync,
    error: errorHandler,
  },
];
```

### Summary

We don't have to enforce our intimate knowledge of generators in situations
where we want to manage redux side effects. Relying on ES2017 async/await is
a simple enough alternative.
