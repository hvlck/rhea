# Archived API Designs

## Testing

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

## Runtime

### Data Model

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

### Extensions and Middleware

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
