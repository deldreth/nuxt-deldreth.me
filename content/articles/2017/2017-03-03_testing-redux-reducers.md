---
title: Testing redux reducers
date: 2017-03-03
tags: ['react', 'redux', 'testing']
---

A coworker asked me to write up an article detailing testing Redux Reducers.

<!--more-->

Writing tests for reducers is pretty straight forward. The examples here are
using <a href='https://github.com/avajs/ava'>ava</a>. I'm also using reduxsauce to quickly produce action types and creators, and an
immutability helper.

## Error Reducer

From this reducer you can see that there are two action types we'll be wanting
to test as well as the initial state of the reducer. The `ERROR_RECEIVE` type
has a creator that will dispatch the action with an expected array of strings
called `errors`. The `ERROR_CLEAR` type will update the state such that `errors`
is an empty array.

```typescript
import update from 'immutability-helper';
import { createReducer } from 'reduxsauce';

import { Types } from 'src/actions';

export const INITIAL_STATE = {
  errors: [],
};

export const HANDLERS = {
  [Types.ERROR_RECEIVE]: (state = INITIAL_STATE, action) =>
    update(state, {
      $merge: { errors: action.errors },
    }),
  [Types.ERROR_CLEAR]: (state = INITIAL_STATE, action) =>
    update(state, {
      $merge: { errors: [] },
    }),
};

export default createReducer(INITIAL_STATE, HANDLERS);
```

## The Initial State Test

We'll start by importing the necessary packages, etc.

```typescript
import test from 'ava';

import reducer, { INITIAL_STATE } from 'src/reducers/error';
import { Creators } from 'src/actions';
```

To test the initial state matches our expected state we will grab the initial state
and pass it through the imported reducer.

```typescript
test('initial state', (t) => {
  t.deepEqual(INITIAL_STATE, reducer(INITIAL_STATE, {}));
});
```

## Testing the Action Creators

Now we want to test our `ERROR_RECEIVE` action type. To do this we create a mock
set of errors we want to pass to our action creator `.errorReceive`, and
specifically call that creator as the action to the reducer. Here we're actually
faciliating part of the middleware execution that would happen in the Store.

We deep equal check that the state matches the object we're expecting.

```typescript
test('dispatch ERROR_RECEIVE', (t) => {
  let state = reducer(INITIAL_STATE, {});

  const errors = ['Woah There!'];
  state = reducer(state, Creators.errorReceive(errors));

  t.deepEqual(state, {
    errors: errors,
  });
});
```

The same is true for testing `ERROR_CLEAR`.

```typescript
test('dispatch ERROR_CLEAR', (t) => {
  let state = reducer(INITIAL_STATE, {});

  state = reducer(state, Creators.errorClear());

  t.deepEqual(state, {
    errors: [],
  });
});
```
