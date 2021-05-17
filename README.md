# rhea

the micro rendering framework

{{ table of contents }}

+ [Tour](https://hvlck.github.io/rhea/tour/)
+ [Docs](./docs/index.md)

## Design

The following is early planning and psuedo-code.

Various things I would like to experiment with before fleshing out design:

+ proxies
+ decorators
+ generators
+ actor model?
  + pub/sub channels using window events?
    + BroadcastChannel/Channel Messaging API?
+ [stream() - Mithril.js](https://mithril.js.org/stream.html)

## Roadmap

+ better typedefs for `build()`; use built-in typedefs for `document.createElement()`
+ some way to use CSS [contrib]
  + maybe use `<template>` for scoping
  + shadow dom?
+ testing framework [contrib]
+ props [core]
+ more events [core]
  + ~~global re-renders~~
  + ~~first initialisation~~
+ i18n internationalisation [contrib]
+ global `state` object to be passed to `history.state` [core]
  + individual `state` objects for each route?
+ easy interface for use as PWAs [contrib]
+ mixins/extensions for various internal events [core]
+ memoization (cached elements), similar to `React.memo()` [core]
+ ssr framework [contrib]
  + may be part of `rheac`
+ tests [core]
  + large amounts of props
  + large amounts of component children
    + this is to test whether calling the `Component`-implementing function on every event/state change is a viable idea
+ `state` API [core]
  + complete rewrite, use state machines
  + `unsubscribe` - unsubscribe from state updates
  + some concept of readable/writable stores similar to svelte
  + state diffing (`new === current`)
  + state guards
    + value checking in proxy stage
  + switch to non-global state by default, register global state if needed
    + `state()` should return an object, `setGlobalState()` should set global state for that object
  + pass state in event handlers bound in `event()`
  + some way to only modify element properties in-place, rather than re-rendering the entire element
+ support for appending Components as children in `std.build()` [core]
+ debug builds [core]
  + may write as extension to core framework
+ component lazy-loading [undecided]
  + `import()`/`satellite.ts`
+ easy method to run most code off-thread using web workers [contrib]
+ decide whether to switch arrow functions to normal functions for perf improvements
+ better event delegation (for bound `<a>` elements and others)
+ transition to deno-based package rather than npm
+ event delegation by default
+ `render()` configuration API
  + ~~`prerender` option, to load routes immediately rather than as needed (2)~~
    + only literal URLs can be pre-rendered, rather than multiple regex matches
  + LRU cache for already-loaded routes (3)
  + for LRU and `prerender`, add some mechanism to override cache
+ add memoization where possible

(2)

```typescript
render({
  prerender: [/prerender/, /\//] // executes the relevant top-level route function on any page load, then stores the result; result is swapped in immediately, bypassing the render cycle
})
```

```typescript
render({
  cache: 3, // will store the 3 last-used routes in cache, and automatically substitute them in rather than going through an entire page render
})
```

## Principles

+ lightweight (<10kb gzipped + minified)
+ safe (easy testing, type-safe)
  + important things (e.g. component/global state) should be proxied
+ reactive (<200ms from event to completely render)
+ smaller things:
  + page should load quickly after a full refresh
