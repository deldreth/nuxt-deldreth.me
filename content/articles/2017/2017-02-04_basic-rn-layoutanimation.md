---
title: Animations in React Native with layoutAnimation
date: 2017-04-02
tags: ['react native', 'animation']
---

Using LayoutAnimation to perform css transition like animations.
I've been working with React Native since early 2016.

<!--more-->

The majority of the Apps
that I've published have been fairly straightforward in their UI and
presentation. Recently, I was tasked with doing some basic animations when
a user interacts with UI. The React Native documentation can be pretty verbose
at times and beat around the most basic features of a component, library, or
api.

In this article I'll discuss the basics of _LayoutAnimation_, how it differs
from the _Animated_ library, and provide some examples of _LayoutAnimation_.

I'll also be providing an
[example repository](https://github.com/deldrethio/rn-example-layoutanimation).

Also, note that according the
documentation LayoutAnimation requires some extra configuration for Android.
The examples in this post will all be geared towards iOS.

### LayoutAnimation vs Animated

React Native offers two animation utilities. The _Animated_ library is a more
full featured tool for doing parallel and sequenced animations. The
_LayoutAnimation_ API provides a way easily animate the frames between
renders and it works much the same way as a css transition would. Providing
a previous layout state and the next layout state.

### App

This app does as simple left and right animation of a TouchableOpacity with a
Text child.

First, take note of the initial state. Here `next` will toggle the animation
either to the left or right (depending on the previous state). The
TouchableOpacity that will be animated gets its left position from the state,
and the onPress event calls the component's onPress method.

With LayoutAnimation you specify one of a few tweening options. Here
`easeInEaseOut()` will provide easing tweens. The onPress function checks to
see if it should be adding or subtracting _50_ with the state's left.
LayoutAnimation takes care of the rest and the frames between the renders
will be animated.

```typescript
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

export default class layoutanimation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      next: 'left',
      left: 0,
    };
  }

  onPress() {
    LayoutAnimation.easeInEaseOut();
    if (this.state.next === 'left') {
      this.setState({ left: this.state.left - 50, next: 'right' });
    } else {
      this.setState({ left: this.state.left + 50, next: 'left' });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ left: this.state.left }}
          onPress={() => this.onPress()}
        >
          <Text>LayoutAnimation</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('layoutanimation', () => layoutanimation);
```

### Summary

LayoutAnimation works well in situations where you are animating against a
single change.
