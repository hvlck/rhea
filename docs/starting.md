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

1. `register(Component)`, to register a component in Rhea's internal tracking system
2. `mount(string | RegExp, () => Component)`, to register a path using Rhea's router
3. `render(options?)`, to draw the current path to the screen

### register

#### Components

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

All components must be registered using the Register API.

```typescript
register(Hello);
```

This ensures Rhea can quickly and easily replicate the component.

### mount

```typescript
mount(string | RegExp, () => Component)
```

The `mount()` function mounts a component at a path.

Paths are routes; when a user navigates to that route, e.g. `/about`, Rhea will search for a matching path and render it.

Paths are registered using the Mount API, like the following:

```typescript
mount('/', () => Index);
// expanded
mount('/', () => () => build('h1', 'Hello!'));
// paths can also be regular expressions
mount(/\//, () => Index);
```

### render

## Utilities

Rhea includes several utilities to easily build elements. The important ones are:

1. `build(type, attributes, children)`, to easily build elements
  + `type` is the type of node (e.g. `h1`)
  + attributes is an `object` of attributes
    + the `text` key is shorthand for `textContent`
    + `data-*` can be written using `data_*`, e.g. `data-value` -> `data_value`
2. `append(parent, ...children)`, to easily append elements
3. `head(...elements)`, to modify the current document head easily
4. `mutate(element, attributes | Function)`, a performant way to mutate an element

### build

### append

### head

### mutate
