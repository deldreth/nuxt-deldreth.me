---
title: Elixir, education and playground
date: 2019-01-20
tags: ['elixir', 'learning']
thumbnail: elixir.png
thumbnailBg: '#CDADE7bf'
---

Elixir has been a language on my list of things to familiarize myself with for a while. Not for any particular reason of my own but it does pose some interesting solutions for difficult performance problems.

<!--more-->

I've often found that the best way to learn features of a new language is to do a little bit of research about what others have to say about it. Familiarize yourself with the basics of syntax and semantics. Then critique the language or system based on what you already know. Admittedly, I don't often wear a full stack hat these days and when I do it's largely Node.js and cloud functions (Lambda in most cases).

I'm not going to go into a lot of details about the merits of Elixir or how it achieves some of it's offerings on the Erlang VM. These are all things that are well documented on https://elixir-lang.org/ or even wikipedia.

A number of these comparisons are going to be made against JavaScript but really any of the prominent C-style languages would apply.

## Match operator vs imperative assignment

This stood out to me as being fairly interesting. It's certainly not something that exists in JavaScript.

In Elixir the match operator `=` is almost equivalent to the assignment operator in an imperative language. It's interesting because this changes up the semantics of the language.

For example:

```elixir
x = 1
```

In an imperative language like JavaScript one would say x equals 1. The value of the variable on the left side of the operator is assigned the value on the right side.

In Elixir it's more acurate to say that x is bound to 1. In the same vein you can evaluate the expression `1 = x`. Where, in an imperative language this would generally fail.

## Conditional annonymous functions

This piece of the language is very interesting and not something I've seen elsewhere. Specifically that you can bind an anonymous function which executes based on some condition of its arguments.

```elixir
git = fn
  "gud" -> "Gitting gud intensifies"
  "bad" -> "You'll never make it"
  _ -> "Catch all!"
end
```

In this situation `git.("gud")` would result in the first string, `git.("bad")` the other, and anything else the last.

## Finishing up

Obviously this isn't a comprehensive list of all the functional, expressional things that exist in Elixir. At this point I've spent less than 4 hours with the language (so I'm obviously no master).
