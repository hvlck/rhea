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
  + ~~`clear()` - clears state~~
  + ~~`lock()` - locks state (Object.freeze)~~
  + ~~`unlock()` - unlocks state~~
  + ~~`subscribe(callbackfn | Set<Component>)` - performs specified callback function or redraws given components whenever state is updated~~
  + `unsubscribe` - unsubscribe from state updates
  + some concept of readable/writable stores similar to svelte
  + state diffing (`new === current`)
  + state guards
    + value checking in proxy stage
  + switch to non-global state by default, register global state if needed
    + `state()` should return an object, `setGlobalState()` should set global state for that object
  + pass state in event handlers bound in `event()`
  + see if local variable declarations will work in Component functions instead of global state registry (1)
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
  + `prerender` option, to load routes immediately rather than as needed (2)
    + only literal URLs can be pre-rendered, rather than multiple regex matches
  + LRU cache for already-loaded routes (3)
  + for LRU and `prerender`, and some mechanism to override cache
+ add memoization where possible

(1)

```typescript
const El = () => {
  const state = { clicks: 0 }
  const el = build("h1", "Clicks: " + state.clicks);
  event(el, "click", () => state.clicks++, { passive: true })
  return el;
}
```

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

## Scratchpad

+ fetch progress
  + `content-length` headers
    + [samundrak/fetch-progress: Progress of response for fetch API](https://github.com/samundrak/fetch-progress)
  + Streams API
    + [AnthumChris/fetch-progress-indicators: Progress indicators/bars using Streams, Service Workers, and Fetch APIs](https://github.com/AnthumChris/fetch-progress-indicators)
  + Writable streams
+ performance testing with `console.profile()`
+ `data-refresh` to refresh all content

## Principles

+ lightweight (>10kb gzipped + minified)
+ safe (easy testing, type-safe)
  + important things (e.g. component/global state) should be proxied
+ reactive (>200ms from event to reaction)
+ smaller things:
  + page should load quickly after a full refresh

### Compile-Time

+ optimisations
  + `preload`
  + `images` (decoding='async', loading='lazy')
+ scaffolding for various pages (e.g. what components the page is initialised with)
+ page component diffing (how components change from one page to another); index of some sorts

#### Testing

```typescript
import SomeComponent from './somepath.ts';
import t from 'rhea-testing'

t('component properly changes ', (test) => {
    const component: HTMLElement = SomeComponent();
    t.click(component, () => {
        const changed: Map<string, string> = new Map();
        changed.set('color', 'red');
        changed.set('background-color', 'purple');
        // key is the HTML property to change
        // value is the value it should be
        t.props(component.style, changed, true)
        // second argument determines whether to test against **all** properties of the given element, rather than the given ones in the map
        // styles should be calculated using getComputedStyle(), rather than the value of the property like elem.style[prop]
    })
});
```

### Runtime

#### Data Model

Rough pseudo-code for a model-data framework for rhea:

```typescript
interface Models {
  // store all bound HTML elements in memory
  // if this does get implemented, benchmark this versus query-selecting everything
  elements: Map<string, HTMLElement[]>,
  // list of all key/value pairs that are bound; the key in this corresponds to the key in the Models.elements property
  models: Map<string, string>,
  // register a new variable to watch
  register: (key: string, value: string, element: HTMLElement): void,
  // update a value, update all elements that use the value
  update: (key: string, value: string): void
}

const models: Map<string, string> = new Map();

// is it possible to wrap a proxy on any key, so that attempts to access the key will result in normal behaviour but also call Models.update() internally rather than the developer having to call it manually?
```

#### Extensions and Middleware

+ similar to expressjs's middleware
+ should also be able to easily register extensions that can be accessed using `rhea.ext.specificExtAPI`

```typescript
import { Sessions } from 'rhea-sessions';

const session = Sessions.from();
// returns object with methods
// e.g.
/*
    return {
        save: () => {...},
        clear: () => {...},
        add: () => {...},
        remove: () => {...}
    }
*/
// should then be able to be called using rhea.ext.sessions.save() or whatever method

rhea.registerExt(session, 'sessions');
```

### Pages

### Components

+ element/component generation should be programatic

```typescript
import c, { Event } from 'rhea';

function handler() { return false }

export default Element = () => {
    // ideally, c will return an extended version of HTMLElement which does not change its type, but adds some new properties
    const element = c('h1', 'sample text');

    element.style('color', 'red').style('background-color', 'purple')
        .intercept(Event.Click, handler)
        .intercept(Event.Mouseover, () => {
            console.log('hovered');
        });

    return element;
}
```

## Contrib

Ideas for optional libraries.

+ sessions (save to local/session storage)
+ cache (dynamic caching like caracal)

## Examples

```typescript
import {
    append as a,
    build as b,
    ComponentEventType,
    ElementTag,
    event as e,
    head as h,
} from "./src/std/index";
import {
    Components,
    Component,
    redraw,
    register,
    mount,
    render,
    state as s,
} from "./src/rt/index";

const Btn = () => {
    const [st, set] = s("btn", { clicks: 0 });
    const nav = b(ElementTag.Div);
    const plus = b(ElementTag.Button, "+");
    const minus = b(ElementTag.Button, "-");

    e(plus, ComponentEventType.Click, () => {
        set({ clicks: st.clicks + 1 });
    });

    e(minus, ComponentEventType.Click, () => {
        set({ clicks: st.clicks - 1 });
    });

    const t = b(ElementTag.P, "Clicks: " + st.clicks);

    return a(nav, t, b(ElementTag.Br), plus, minus);
};

register(Btn);
```
