---
title: Node, mongoose, and user authentication
date: 2017-02-02
tags: ['node', 'mongodb', 'authentication']
---

Code snippets for user authentication with mongoose schemas.

<!--more-->

The following code snippets represent a straight forward approach to baking salted password authentication into your node service with Mongoose.

User Model Schema

```javascript
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
});
```

Since the `salt` is required we want to generate the salt on the prevalidate hook through Mongoose.

I'm going to define a few constants that will be used for hashing.

```javascript
const HASH_ITERATIONS = 10000;
const HASH_KEYLEN = 512;
```

```javascript
UserSchema.pre('validate', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  user.salt = crypto.randomBytes(16).toString('hex');

  crypto.pbkdf2(
    user.password,
    user.salt,
    HASH_ITERATIONS,
    HASH_KEYLEN,
    'sha512',
    (err, key) => {
      if (err) {
        throw err;
      }

      user.password = key.toString('hex');
      next();
    }
  );
});
```

Crypto's pbkdf2's signature is `crypto.pbkdf2( password, salt, iterations, keylen, digest, callback )` function allows us to specify the number of iterations against a particular hashing algorithm. In this case the salt will be iterated against the cleartext password _10000_ times using SHA512. Increasing the key length will obviously result in a more complex hash.

_Keep in mind that pbkdf2 here is asynchronous. Crypto also provides a synchronous option. Remember that node is single threaded and this operation will block._

Next we want to provide our models of this schema a method for comparing cleartext passwords with the hash that we generated in the prevalidate section.

```javascript
UserSchema.methods.comparePassword = function (checkPassword, done) {
  const user = this;

  crypto.pbkdf2(
    checkPassword,
    user.salt,
    HASH_ITERATIONS,
    HASH_KEYLEN,
    'sha512',
    (err, key) => {
      const hash = key.toString('hex');

      if (err || hash !== user.password) {
        return done(err);
      }

      done(null, true);
    }
  );
};
```

Models that implement `UserSchema` will now have a method `comparePassword` that accepts a cleartext password and a callback. Here the call expects to have two potential arguments. The first being a error and the second being true if the passwords match.

### Summary

User authentication doesn't have to be super complicated with Mongo, and we can extend functionality provided by Mongoose so our models end up doing the heavy lifting.

You can also export the model immediately.

```javascript
module.exports = Mongoose.model('User', UserSchema);
```
