---
title: Testing redux sagas
date: 2016-07-30
tags: ['react', 'testing', 'redux']
thumbnail: Redux-Saga-Logo.png
thumbnailBg: '#d8f1d040'
---

I've been debating what I should tackle as my first article. I've never been the best at writing technical articles or how-to guides, but it is something I've always wanted to put to my hands.

<!--more-->

After listening, and watching, A. Jesse Davis' ["Write an Excellent Programming Blog"](https://talkpython.fm/episodes/show/69/write-an-excellent-programming-blog) I've felt more compelled to give it try.

### What to expect?

First off I'm approaching this testing platform from a react-native perspective and may make mention of react-native quite a bit. That being said this article is intended to be a concise push towards testing redux-sagas. Something that in my mind is very useful, but the documentation about methods of testing sagas can be lacking. I've seen a good number of questions about testing sagas with most of the answers not really breaking down what's actually happening. Like most things, there's no one way to test.

This article expects that you have some working knowledge of:

- es6, generators
- redux
- redux-saga
- ava and mocha

### Why test your Sagas?

Sagas, at a very high level, offer a way to handle synchronous actions from asynchronous events. Often enough I've used them as API call handlers where I expect some series of events to take place as part of a data request. It could be as simple as handling a success or failure event from an http request. There could also be multiple http requests with conditionals that break out into different synchronous paths when other asynchronous events occur. It can quickly become a very complicated endeavour to ensure that your sagas are behaving the way you expect.

### Setup

```javascript
import { take, put, call } from 'redux-saga/effects';

import Types from '../Actions/Types';
import Actions from '../Actions/Creators';
import Api from '../Services/Api';

export function* watchLogin() {
  while (true) {
    const { username, password } = yield take(Types.LOGIN);

    try {
      const user = yield call(Api.login, username, password);
      yield put(Actions.loginSuccess(user));
    } catch (error) {
      yield put(Actions.loginFailure(error));
    }
  }
}
```

The above snippet is a very basic saga. It yields three things: waits for the LOGIN action (storing a username and password), calls the api, and then puts either the LOGIN_SUCCESS or LOGIN_FAILURE action from the action creator. This saga will be used for the test examples.

### Create a Stepper Helper Function

There are a few interesting things one can do when you start testing sagas. Consider if you will the following snippet.

```javascript
const sagaStepper = (iterator) => (mockData) => iterator.next(mockData).value;
```

So we've declared sagaStepper as a function that we expect to take a generator as an argument and that function's return will expect some mocked data (we'll be using objects). This sort of pattern is very useful for abstracting away what the saga generator is actually doing. It lets us do the following:

```javascript
const step = sagaStepper(saga());
```

Now step is a function that can be used to iterate and retrieve the sequential state of the saga when needed.

### Testing with AVA

One of the nice features about ava is the visual breakdown of the call stack upon an error. Give it a try. You'll see what I mean.

```javascript
import test from 'ava';
import { take, put, call } from 'redux-saga/effects';

import { watchLogin } from '../Sagas/AuthSaga';
import Types from '../Actions/Types';
import Actions from '../Actions/Creators';

import Api from '../Services/Api';

const sagaStepper = (iterator) => (mockData) => iterator.next(mockData).value;

test('the watch login saga for success', (t) => {
  const step = sagaStepper(watchLogin());
  const mock = { username: 'fuz', password: 'baz' };

  t.deepEqual(step(), take(Types.LOGIN));

  t.deepEqual(step(mock), call(api.login, mock.username, mock.password));

  t.deepEqual(step(), put(Actions.loginSuccess('some http response')));
});
```

So now we have a test that will step through the watchLogin saga created earlier. Remember that there were three yields from the saga. The execution of the saga began the first call to our step function. So the first test:

```javascript
t.deepEqual(step(), take(Types.LOGIN));
```

Checks to see that the state of the generator's yield matches our expected yield. In this case step represents the state of the saga at `const { username, password } = yield take(Types.LOGON);` and our test is to verify that the first step is in fact a yield to take on the action type LOGIN.

The next test can get tricky and seems to be where a lot of people end up stumbling. Notice that we're passing our mock data object into step and recall that the step function accepts some abitrary data and passes that on to the iterator. This is essentially setting the state of the saga manually. Then the test is much like the first: we're expecting the next step to be a yield to call and that yield to call is calling the api.login function with two arguments. The saga call to api is using the destructured assigned object mock as the values for email and password.

The final test is much the same. We're expecting the next step to be a yield to put with the LOGIN_SUCCESS action creator that has some notion of a response.

What about the error that can be caught from the saga? This example only tests the case where the API gives us some not-bad-return. Assume if you will that the Api.login in this example is some static fixture. The call to login just returns an expected "right" value that always allows it to pass the error check. In this case our iteration helper function isn't very helpful. We have no way to tell the saga that there's an error. Realistically the Api, fixture or otherwise, could return a correct state or throw an error on wrong output, but I've contrived this example.

```javascript
test('the watch login saga for failure', (t) => {
  const iterator = watchLogin();
  const mock = { username: 'fuz', password: 'wrong' };

  t.deepEqual(iterator.next().value, take(Types.LOGIN_ATTEMPT));

  t.deepEqual(
    iterator.next(mock).value,
    call(api.authenticate, mock.email, mock.password)
  );

  t.deepEqual(
    iterator.throw('error').value,
    put(Actions.loginFailure('error'))
  );
});
```

In this test we've removed the use of our iteration helper and are relying on stepping through the values of the saga manually at each test. This allows us to throw an error on the last step and we can expect a yield to put for the LOGIN_FAILURE action.

That's essentially it. Testing step by step works well when you have concise synchronous yields in your sagas. Ultimately I will have another article at some point at more complex tests for sagas that fork, etc.

### Testing with Mocha and Redux Mock Store

redux-mock-store (https://github.com/arnaudbenard/redux-mock-store) allows you to mock reducer state to actions for the purpose of testing. It provides a middleware layer much like redux's store which can be used used with the redux-saga middleware. Consider the following test:

```javascript
import configureMockStore from 'redux-mock-store';
import sagaMiddleware from 'redux-saga';
import fetchMock from 'fetch-mock';

import Api from '../Services/Api';
import Types from '../Actions/Types';
import Creators from '../Actions/Creators';
import { watchLogin } from '../Sagas/AuthSaga';

const middlewares = [sagaMiddleware(watchLogin)];
const mockStore = configureMockStore(middlewares);

describe('authentication saga', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should LOGIN', (done) => {
    fetchMock.mock(Api.getBaseUrl() + '/login', 'POST', {
      data: {
        response: 'some http response',
      },
    });

    const expectedActions = [
      { type: Types.LOGIN, username: 'fuz', password: 'baz' },
      { type: Types.LOGIN_SUCCESS, response: 'some http response' },
    ];

    const getState = {
      auth: {
        is_authed: false,
        user: null,
      },
    };

    const store = mockStore(getState, expectedActions, done);
    store.dispatch({ type: Types.LOGIN, username: 'fuz', password: 'baz' });
  });
});
```

We are using fetchMock to return data for this test. Note how we've created an array of expected actions that precisely define each step of the saga. Much like the ava example, but we're being very up front about what we expect to see from our saga.

This test pattern lends itself well ensuring that each yield within the path of expected execution is tested. If, for some reason, another action occurred that was not part of the expected actions it would error. In our previous ava example each step of the saga must be accounted for manually. There's nothing that would pick up on an extraneous action (should there be one).

I'm not going to go too far in depth about mocha testing with redux-mock-store. Compared to the manual iteration method I described in ava I feel that this approach is very straight forward. Also note that this example does not actually test the reducer that could be handling these actions.

### Summary

Saga unit or behaviorial testing doesn't have to be an elephant in the room. In cases where your sagas are straight forward synchronous yields it's simple to iterate through each state of the saga and test its expected outcome. Packages like redux-mock-store can assist in testing the entire set of states for a saga by predefining the expected states.

Good luck testing.
