# API Design Proposals

`API proposals to be considered for addition to rhea.`

## Async Component API

+ makes `Component` types return an async function or generator which will be called once when initialising a component.

## mutation API

`mutate(element, { [key: string]: string | boolean | undefined } | Function)`

+ batches mutations to existing elements
+ maybe add additional `boolean` final argument for whether to check for key equality between old/new values (default: `false`)
  + e.g. if replacing `style.background`, previous is `blue` and the new is `blue`, nothing will happen

## Removal of State API

+ remove State API as it can be replaced using a locally-scoped object
+ add small state machine library?
  + alternatives exist, unsure of bundle size

## See Also
