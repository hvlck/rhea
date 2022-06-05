# rhea

`small rendering framework`

+ [Tour](https://noctiverse.github.io/rhea/tour/)
+ [Docs](./docs/index.md)

Rhea is a small rendering framework I made for my own use. It's designed to be as performant as possible using the simplest and most basic browser APIs.

## Roadmap

+ fix package type definition exports
+ some way to use CSS [contrib]
  + maybe use `<template>` for scoping
  + shadow dom?
+ easy interface for use as PWAs [contrib]
+ mixins/extensions for various internal events [core]
+ tests [core]
  + large amounts of props
  + large amounts of component children
    + this is to test whether calling the `Component`-implementing function on every event/state change is a viable idea
+ easy method to run most code off-thread using web workers [contrib]
+ better event delegation (for bound `<a>` elements and others)
+ transition to deno-based package rather than npm
+ event delegation by default
+ `render()` configuration API
  + ~~`prerender` option, to load routes immediately rather than as needed (2)~~
    + only literal URLs can be pre-rendered, rather than multiple regex matches
  + LRU cache for already-loaded routes (3)
  + for LRU and `prerender`, add some mechanism to override cache
