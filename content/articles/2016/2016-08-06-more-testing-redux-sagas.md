---
title: Testing redux sagas, round two
date: 2016-08-06
tags: ['react', 'testing', 'redux']
published: true
---

Going further in depth on patterns for testing sagas.

<!--more-->

Previously I discussed the possibilities surrounding unit tests for generators using redux-saga.
I also mentioned that I'd like to go a little further in depth about more complicated redux-saga specific patterns.
Last time we only tested three saga effects: take, put, and call. This time I'll be covering select and fork.

If you recall the basic iterative approach for testing a saga is:

<ol class="list-decimal">
  <li>Step through the expected yield</li>
  <li>Inject state</li>
  <li>Check for equality</li>
  <li>Rinse and Repeat until the yields are exhausted</li>
</ol>

This statement works well in practice, but does it apply to sagas that fork (create branches of execution)? The quick answer is yes.

### Source Code

I've created a [test project](https://github.com/deldrethio/more-testing-redux-sagas) on github that you can use to follow along or practice testing sagas yourself. The application is a very basic redux application (without any actual reducers).

Update. I've also added redux-mock-store style tests to the example tests.

### The Sagas

For this example I've created two sagas. One intended to yield to take on some LOGIN action. The other is a simple one off generator that does not iterate. Though it could very easily be made to do so and it changes the tests very little. Also, this exampe is partially derived from a react-native application so the activity action creators are really just there to illustrate sequential yield testing.

The watchLogin saga, much like my previous example, yields to take for a username and password and then does some basic "I'm doing this" sort of actions, calls an API function, handles the response. If the response is good it will fork another saga.

```typescript
export function* watchLogin() {
  while (true) {
    const { username, password } = yield take(Types.LOGIN);

    yield put(Actions.startActivity());

    const response = yield call(Api.login, username, password);

    yield put(Actions.endActivity());

    if (response.ok) {
      yield put(Actions.loginSuccess(response.data));

      yield fork(fetchUser);
    } else {
      yield put(Actions.loginFailure(response.data));
    }
  }
}
```

The fetchUser saga isn't what's colloquially referred to as a watching saga. It doesn't yield to take. It expects that the state is to the point that it has everything it needs to make another API call. If auth wasn't set in the state this saga would fail as it yields to select to get the state. If you're not familiar with the concept of selectors I suggest looking at the reactjs/reselect project. Selectors have become the defacto method for getting state in the redux world. In this case the getState selector is actually returning the entire state of the application. Of course, selectors can be made to be very precise in what pieces of state they return.

```typescript
export function* fetchUser() {
  const { auth } = yield select(getState);

  yield put(Actions.startActivity());

  const response = yield call(Api.getUser, auth.auth_token);

  yield put(Actions.endActivity());

  if (response.ok) {
    yield put(Actions.receiveUser(response.data));
  } else {
    yield put(Actions.receiveErrors(response.data));
  }
}
```

### Testing Saga Select Effects

We've seen how state must be injected on the test end after the yield to a take or call has occurred. Yields to select effects are no different. The following is an excerpt from the entire test of the watchLogin saga.

```typescript
t.deepEqual(userStep(), select(getState));

t.deepEqual(userStep(getState()), put(Actions.startActivity()));
```

The userStep saga's first yield is a select. The getState() function is just a selector that returns some mock state. Again, this is the same as state injection for other saga effects.

### The Whole Test

Testing for yields to fork effects are much like any other tests. We know that a step of the watchLogin saga will fork and we know which generator the fork will execute.

```typescript
import test from 'ava';
import { take, select, put, call, fork } from 'redux-saga/effects';

import { watchLogin, fetchUser } from '../../src/sagas';
import Actions from '../../src/actions/creators';
import Types from '../../src/actions/types';

import Api from '../../src/services/fixtureApi';

import { getState } from '../../src/reducers/selectors';

const stepper = (fn) => (mock) => fn.next(mock).value;

test('the watch login saga', (t) => {
  const step = stepper(watchLogin());
  const mock = {
    username: 'test',
    password: 'test_pass',
  };

  const mockResponse = {
    ok: true,
    data: {
      auth_token: '1234',
    },
  };

  t.deepEqual(step(), take(Types.LOGIN));

  t.deepEqual(step(mock), put(Actions.startActivity()));

  t.deepEqual(step(), call(Api.login, mock.username, mock.password));

  t.deepEqual(step(mockResponse), put(Actions.endActivity()));

  t.deepEqual(step(), put(Actions.loginSuccess(mockResponse.data)));

  t.deepEqual(step(), fork(fetchUser));

  const userStep = stepper(fetchUser());
  const mockGetUserReponse = {
    ok: true,
    data: {
      name: 'Rick Deckard',
      address: 'Earth',
    },
  };

  t.deepEqual(userStep(), select(getState));

  t.deepEqual(userStep(getState()), put(Actions.startActivity()));

  t.deepEqual(userStep(), call(Api.getUser, getState().auth.auth_token));

  t.deepEqual(userStep(mockGetUserReponse), put(Actions.endActivity()));

  t.deepEqual(userStep(), put(Actions.receiveUser(mockGetUserReponse.data)));

  // The watchFetchUser saga does not iterate
  t.is(userStep(), undefined);

  // For good measure, lets see if the prefork watchLogin saga is where we expect
  t.deepEqual(step(), take(Types.LOGIN));
});
```

Notice that I've created a new helper function called userStep to iterate through the forked generator. Also keep in mind that placing the tests for both of these sagas within the same test callback isn't necessary. I did it simply to illustrate the sequential nature of what's being tested. You could very easily test the step of watchLogin for a yield to fork and end the test callback there.

This test also does some final follow up. Remember that the fetchUser generator isn't an iterating saga. So once we've stepped through the receiveUser action (the last action) there are no more yields. Calling the userStep helper function once more will return undefined. I've also shown that one final call to the step helper function should yield to take. Now we see that the original "calling" saga is back at the beginning of its iteration.

# Summary

Sagas can be tricky to test. I've seen a lot of folks inadvertently stumble over the injection of state at each yield as part of their testing process. Ultimately though testing the more complicated saga effects is similar to other tests for the more "basic" saga effects. Eventually I'll cover tests for the saga helper functions takeEvery and takeLatest, concurrency, and the race effect.
