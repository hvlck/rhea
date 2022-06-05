# Getting Started

## On the Web

+ [repl.it hello world](https://replit.com/@EthanJustice/rhea-starter)

1. import rhea
  + [unpkg](https://unpkg.com/browse/@rhea.ts/core@latest/dist/rhea.es2017.js)
  + [jsdelivr](https://cdn.jsdelivr.net/npm/@rhea.ts/core@latest/dist/rhea.es2017.min.js)
2. then add a `<script>` tag to your HTML as follows:

```html
<script src="{{cdn}}" type="module"></script>
```

and you're all set.

## Locally

+ make sure you have `npm` or `yarn` installed
+ run `yarn add @rhea.ts/core` or `npm add @rhea.ts/core` to install the core Rhea library
+ ensure you have a suitable bundler or transpiler if you're using TypeScript

## Terms

## Runtime

Rhea's runtime has three functions. `Component` refers to a type with a signature `() => HTMLElement`.

1. `register(...components)`, to register components in Rhea's internal tracking system
2. `mount(string | RegExp, () => Component)`, to register a path using Rhea's router
3. `render(options?)`, to draw the current path to the screen

### register

```typescript
type Component = () => HTMLElement;
```

Components are Rhea's fundamental building block. A valid component has a type signature of `() => HTMLElement`.

A very basic one looks like this:

```typescript
const Hello = () => build('h1', 'Hello'); // <h1>Hello</h1>
```

Expanded, the component looks like this:

```typescript
const Hello = () => {
  return build('h1', 'Hello');
}
```

Components that are called in the `mount()` or use the `redraw()` function must be registered. Registering a component ensures Rhea can hydrate the component when the router requires it. Note that you can call the `mutate()` function on any element, not just registered components.

```typescript
register(Hello);
```

### mount

```typescript
mount(string | RegExp, () => Component)
```

The `mount()` function mounts a component at a path. Exact string matches will have a higher precedence than regular expression matches.

Paths are routes; when a user navigates to that route, e.g. `/about`, Rhea will search for a matching path (like `"/about"` or `/abo.t/`) and render it.

```typescript
mount('/', () => Index);
// expanded
mount('/', () => () => build('h1', 'Hello!'));
// paths can also be regular expressions
mount(/\//, () => Index);
```

### render

```javascript
/**
 * Initalisation options for Rhea.
 * @param prerender Prerenders the given routes. The route will be loaded in the background, and swapped if navigated to. If you need real-time results, do not use this.
 * @param cache Maximum number of items to hold in the LRU cache. This functions similarly to `prerender`, but only adds items to the cache once they're navigated to.
 */
interface RenderOptions {
    prerender?: Route[];
    cache?: number;
}

const render = (options?) => {...}
```

`render()` initializes `rhea`. This function must be called for an app to start.

`options` is an optional parameter for `rhea`'s configuration. See the code above for values and their purposes.

Note that there are two other parameters, `prev` and `route`, that are set internally. Do not set these parameters yourself unless you know what you're doing.

## Utilities

Rhea includes several utilities to easily build elements. The important ones are:

1. `build()`, to easily build elements
  + `type` is the type of node (e.g. `h1`)
  + attributes is an `object` of attributes
    + the `text` key is shorthand for `textContent`
    + `data-*` can be written using `data_*`, e.g. `data-value` -> `data_value`
2. `append(parent, ...children)`, to easily append elements
3. `head(...elements)`, to modify the current document head easily
4. `mutate(element, attributes | Function)`, a performant way to mutate an element

### build

```javascript
const build = (type, attributes?, ...children?): HTMLElement => {...}
```

`build()` is a utility for creating elements easily.

The `type` parameter can be a string or component (either an HTML element name or a function from which an element is generated).

The `attributes` parameter can either be an object, `undefined`, or a string. A string value will set the element's `textContent` property. A value of `undefined` will not set any properties. An object value set each value as that key's attribute on the element. There are several caveats:

1. The key `class` will set the element's `className` attribute by splitting the provided value at each space (note that `className` can still be used)
2. Events can be attached by prefixing a key with `on` (e.g. `onClick` will bind the provided value to the `click` event)
3. `data-*` attributes can be set by replacing the hyphen (`-`) with an underscore (`_`), or by making the key a string (e.g. `"data-example": "example value"`)
4. `text` will set the `textContent` value if passed as a key of an object. This can be used if you intend to set multiple properties, as well as a text value for the element.

The `children` parameter is a variadic parameter. Elements passed will be appended to the element being built by the function, using the `append()` function, which uses several performance optimizations. `build()` calls can be nested as arguments to the `children` parameter (see below).

The function returns an `HTMLElement`.

```typescript
const $h3 = build('h3', 'Welcome to Rhea!');
const $empty = build('p');

const $el = build('div', undefined, build('h1', 'Hello, ', build('span', { text: 'world!', style: 'color: red' })), $h3, $empty)

// <div>
//   <h1>Hello, <span style="color: red">world!</span></h1>
//   <h3>Welcome to Rhea!</h3>
//   <p></p>
// </div>
```

### append

```javascript
const append = (parent, ...children) => {...}
```

`append()` is a utility for appending child elements to a parent.

```typescript
const $parent = build('div');
const $kids = [build('p', 'Lorem '), build('p', 'ipsum')];
append($parent, ...$kids);

// equivalent to
build('div', undefined, build('p', 'Lorem '), build('p', 'ipsum'))
```

### head

`experimental`

### mutate

```javascript
const mutate = (element, props) => {...}
```

`mutate()` updates an element's properties using a batch write to increase performance.

`element` is an HTML/JSX element.

`props` is an object. Each key corresponds to an attribute name, and its value corresponds to an attribute value.

### update

```typescript
const update = (fn: () => any, component: Component) => {...}
```

`update()` redraws a component after the passed function argument is called. `mutate()` should be used if you're only updating an element's property.
