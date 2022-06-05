# rhea

`small rendering framework`

+ [Docs](./docs/index.md)

`rhea` is a small rendering framework I made for my own use. It's designed for performance and ease of use.

It's mostly completed at this point. `rhea` isn't really meant/built for production use, but I've found it to be fun for use on side projects.

See the [docs](./docs/index.md) to get started.

## Roadmap

+ easy interface for use as PWAs [contrib]
+ mixins/extensions for various internal events [core]
+ tests [core]
  + benchmarks
    + large amounts of props
    + large amounts of component children
      + this is to test whether calling the `Component`-implementing function on every event/state change is a viable idea
+ easy method to run most code off-thread using web workers [contrib]
+ better event delegation (for bound `<a>` elements and others) [core]
+ event delegation by default [core]
+ `render()` configuration API
  + ~~`prerender` option, to load routes immediately rather than as needed (2)~~
    + only literal URLs can be pre-rendered, rather than multiple regex matches
  + LRU cache for already-loaded routes (3)
  + for LRU and `prerender`, add some mechanism to override cache
+ fix code issues [core]
  + type assertions
  + redundancy
  + comments/docs
+ performance [core]
  + excessive renderings
  + component diffing
