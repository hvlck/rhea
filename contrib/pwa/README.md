# PWA

Rhea PWA utilities and library.

## Design

`Initial API planning.`

### Registration

```typescript
const r = await register('/path-to-worker.js');
if (r) {
    // ... do something now that worker's registered
} else {
    // ... registration failure
}
```

### Static Asset Caching

```typescript
const stored = await cache(['index.html', 'index.js', 'image.png']);
if (stored) {
    // ... successfully stored static assets
} else {
    // ... uh-oh
}
```

#### Updating

```typescript
const swapped = await swap(['index.html', 'another-index.html'], ['index.js', 'new-index.js']); // swaps items stored in cache

const updated = await update('index.html', 'another-index.html'); // updates existing pages
```

#### Deleting

```typescript
const deleted = await remove('index.html', 'index.js');
```

### Storing Data

### Messaging API

Messaging API is used to execute code in the worker itself.

```typescript
const extension = await register('netcheck', () => {
    // ...
})
const msg = await message('netcheck', { time: '22:10' });
const fetched = await on('fetched', () => {
    // ...
})
```

### PWA API

```typescript

```
