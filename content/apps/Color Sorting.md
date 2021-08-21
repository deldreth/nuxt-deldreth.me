---
title: Color Sorting
date: 2020-12-20
tags: ['web components', 'stencil']
thumbnail: apps/deldreth.me_color-sorting.png
thumbnailBg: '#d8f1d0'
link: http://color-sorting.s3-website-us-east-1.amazonaws.com/
github: https://github.com/deldreth/color-sorting
published: true
---

After playing a mobile game where colored liquids were transferred into different bottles based on topmost color and existing volume. I decided to spend an afternoon to build out a web based version of the game. This gave me a chance to experiment with Ionic's [Stencil.js](https://stenciljs.com/) and ended up being a good development excercise.

<!--more-->

<script type="module" src="http://color-sorting.s3-website-us-east-1.amazonaws.com/components/components.esm.js" crossorigin="anonymous"></script>

## Game

<iframe src="http://color-sorting.s3-website-us-east-1.amazonaws.com/" class="w-full h-96"></iframe>

## Premise

The game board consists of a user defined (defaults to 6) bottles arranged in a grid. Each bottle contains four quarter segments of color that can be transferred from one bottle to another by clicking on a bottle and then clicking on another bottle.

Color will only be moved if:

1. The receiving bottle is empty.
1. The receiving bottle's top most color is the same as the providing bottle.
1. The receiving bottle's remaining volume is greater than or equal to the color volume that will be transferred.

The UI should provide:

1. As close to an ADA compliant color scheme as possible (difficult in games with 8+ colors).
1. Visual indicator that a bottle is selected.
1. Visual indicator that a transfer is invalid.
1. Visual indicator that the game is complete.
1. An optional mechanism to undo any transfer.
1. Controls to adjust the game difficulty.
   - Number of colors
   - Number of undoes
1. Controls to create a new game and reset the current game.
1. Help control to visually convey how to play the game.
1. A count of the number of moves.

## Tech Stack

_Lerna_, the repository is a monorepo with the intent of providing separation of the underlying UI components of the game with the container and business logic of the game.

_Stencil.js_, Ionic's framework for creating and publishing web components. There are two packages within the monorepo: components and game. Both of these packages were scaffolded with Stencil.js. With the components package using the component base and the game package using the app base.

## Structure

<div class="flex">
  <div>
	  <a-bottle colors='["rebeccapurple"]'/>
  </div>

  <div class="flex-1 ml-4">
    The a-bottle web component is the base UI element provided from the components package. It can receive a few props that allows the controlling board to alter its state.
  </div>
</div>

| Property   | Attribute  | Description                                 |
| ---------- | ---------- | ------------------------------------------- |
| `colors`   | `colors`   | The list of colors represented as an array  |
| `finished` | `finished` | Indicate a winning state                    |
| `selected` | `selected` | Indicate that the bottle is selected        |
| `warning`  | `warning`  | Indicate that the bottle cannot be targeted |

<div class="flex">
  <div class="flex-1 mr-4">
    The most important of these props being colors which receives a string encoded JSON that represents the HTML or hex colors contained in the bottle. Rendered top down from left to right.

```html
<a-bottle colors='["#bd93f9", "#ff5555", "#50fa7b", "#ffb86c"]' />
```

  </div>

  <div>
    <a-bottle colors='["#bd93f9", "#ff5555", "#50fa7b", "#ffb86c"]'/>
  </div>
</div>
