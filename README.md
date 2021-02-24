# rhea

the micro rendering framework

## Design

The following is early planning and psuedo-code.

Various things I would like to experiment with before fleshing out design:

+ proxies
+ decorators
+ generators
+ actor model
  + pub/sub channels using window events?

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
