// rhea runtime
export type Component = () => HTMLElement;

export * from "./state";

/**
 * Components is a list of unique components and the functions that generate them.
 * The key is the function name; **these should be unique**.
 * The function is the function that generates a new HTMLElement; this should be in its return value.
 * It is recommended that you do not modify this directly.
 */
export const Components: Map<
    string,
    { fn: Component; el: HTMLElement }
> = new Map();

/**
 * Index is the index of routes (based on `window.location.pathname`) and the corresponding list of components that it consists of.
 * The key is the route, and the value is the list of components the route is made of.
 * It is recommended that you do not modify this directly.
 */
export const Index: Map<string | RegExp, Set<string>> = new Map();
export const NotFound: Set<string> = new Set();

/**
 * Re-renders items whenever the user uses the browser's forward/back buttons
 */
window.addEventListener("popstate", () => {
    emit(document.body, EventType.BeforePageChange);
    render({}, true);
    emit(document.body, EventType.AfterPageChange);
});

/**
 * Registers a component with the given name
 * @param name The name of the component - note that this must be unique for all components. If there is one component on `/` named `Nav`
 * and a different component on `/about` also named `Nav`, their names will conflict. You can circumvent this by prefixing
 * the name with the route, e.g. `/:nav` and `/about:nav`
 * @param element The function that returns an HTMLElement
 */
export const register = (...elements: Component[]) => {
    return elements
        .map(element => {
            const n = element.name.toLowerCase();
            if (Components.get(n)) {
                throw Error(`component ${n} has already been defined!`);
            } else {
                const ob = {
                    fn: element,
                    el: element.call(null),
                };

                Components.set(element.name.toLowerCase(), ob);
                return true;
            }
        })
        .some(i => (i == false ? false : true));
};

type Route = string | RegExp | undefined;

/**
 * Registers components for a given route. When the given `route` is navigated to, the `page` callback will be called.
 * @param route The paths you want to register the component for
 * @param page The components you want to register on the path
 */
export const mount = <T extends { [key: string]: any }>(
    route: Route,
    page: (state?: T) => Component
) => {
    const fn = page.call(null).name.toLowerCase();
    if (route == undefined) {
        NotFound.add(fn);
    } else {
        Index.set(route, new Set<string>().add(fn));
    }
    return true;
};

// removes all children from the given element
const removeAll = (el: HTMLCollection) => {
    window.requestAnimationFrame(() => {
        Array.from(el).forEach(i => i.remove());
    });
};

/**
 * Navigates and renders the given page.
 * @param destination The url to go to.
 * Note that you can easily create a new URL class by calling new URL(href), and substituting `href` for the destination,
 * such as one from an `<a>` element.
 */
export const navigate = (destination: URL | string) => {
    const old = window.location.pathname;
    const p: string =
        typeof destination == "string" ? destination : destination.pathname;
    if (p != old) window.history.pushState("", "", p);

    emit(document.body, EventType.Navigation, {
        old,
        next: p,
    });
    render({}, true);
    emit(document.body, EventType.AfterNavigationChange);
};

/**
 * Note that the render event will be scoped to the element is called on, while the before/after page change events
 * are called on `document.body`
 * // todo: fix after/before page change and navigation events
 * @param Initialized Fired when a component is initialised for the first time; note that this is called on `document.body` and its `event.detail` object contains a `component` key
 * @param Navigation Fired immediately after history.pushState() is called
 * @param Render The render event, called whenever a page is rendered.
 * @param Redraw Fired on a component when that component has been redrawn
 * @param GlobalRender Called on `document.body` whenever the page is changed and triggers a complete rerender.
 * @param BeforePageChange Called before a page is changed using the History API
 * @param AfterPageChange Called after a page is changed and rendered.
 * @param AfterNavigationChange Called after a page has been navigated to
 */
export enum EventType {
    Initialized = "initialized",
    Navigation = "navigation",
    Render = "render",
    Redraw = "redraw",
    GlobalRender = "global-render",
    BeforePageChange = "before-page-change",
    AfterPageChange = "after-page-change",
    AfterNavigationChange = "after-navigation-change",
}

// emits an event on the given element
const emit = (el: HTMLElement, event: EventType, detail?: Object) =>
    el.dispatchEvent(new CustomEvent(event.toString(), { detail }));

// helper function for binding `<a>` elements to prevent default navigation behaviour
export const goTo = (evt: Event, url: URL) => {
    evt.preventDefault();
    if (evt.defaultPrevented == true) {
        navigate(url);
        return true;
    }

    return false;
};

/**
 * Returns a component list for the matching URL path. Note that exact string matches have higher precedence
 * than RegExp matches. A return of `false` indicates that there is no match.
 * @param destination The pathname to check for dynamic paths
 */
const path = (destination = window.location.pathname) => {
    const r = Array.from(Index)?.find(([i, s]) => {
        // exact matches will have precedence
        if (typeof i == "string" && i == destination) {
            return s;
        } else if (i instanceof RegExp && i.test(destination) == true) {
            return s;
        } else {
            return false;
        }
    });
    if (r && r[0]) return r[1];
    else {
        return false;
    }
};

interface RenderOptions {
    prerender?: Route[];
    cache?: number;
}

export const prerender = (route: Route, set = false): DocumentFragment => {
    let frag = new DocumentFragment();

    let components: Set<string> | undefined;
    if (route == undefined) {
        components = NotFound;
    } else {
        components = Index.get(route);
    }

    const h = () => {
        if (components == undefined) return;
        components.forEach(i => {
            const cmp = Components.get(i);
            if (cmp) {
                frag.appendChild(hydrate(cmp.fn));
            } else {
                throw Error(
                    `component ${i} is not registered in the component registry`
                );
            }
        });
    };

    if (components != undefined) {
        h();
    } else {
        if (route instanceof RegExp) {
            Index.forEach((_, v) => {
                if (v instanceof RegExp) {
                    if (
                        v.source === route.source &&
                        v.global === route.global &&
                        v.ignoreCase === route.ignoreCase &&
                        v.multiline === route.multiline
                    ) {
                        components = Index.get(v);
                        h();
                    }
                }
            });
        } else if (typeof route == "string") {
            Index.forEach((_, v) => {
                if (v instanceof RegExp && v.test(route) == true) {
                    components = Index.get(v);
                    h();
                }
            });
        }
    }

    if (set == true && cache.has(route) == false) cache.set(route, frag);

    return frag;
};

export const cache: Map<Route, DocumentFragment> = new Map();

/**
 * Renders all components.
 * @param prev Whether or not render is being called from a popstate event so that the DOM can be cleared. Do not set this parameter.
 */
// todo: figure out a way to diff components on current page and next page, so that same components will not be removed
export const render = (options?: RenderOptions, prev = true) => {
    const t = `${Math.ceil(Math.random() * 2000)}`;
    console.time(t);
    if (prev) removeAll(document.body.children);

    const r = (components: Set<string>, route?: Route) => {
        let frag = new DocumentFragment();

        const cached = cache.get(route);
        if (cached == undefined) {
            components.forEach(i => {
                const cmp = Components.get(i);
                if (cmp) {
                    frag.appendChild(hydrate(cmp.fn));
                } else {
                    throw Error(
                        `component ${i} is not registered in the component registry`
                    );
                }
            });
        } else {
            frag = cached;
        }

        window.requestAnimationFrame(() => {
            document.body.append(frag);
            emit(document.body, EventType.GlobalRender);
        });
    };

    if (options?.prerender)
        options.prerender.forEach(i =>
            // @ts-ignore
            window.requestIdleCallback(() => prerender(i, true), {
                timeout: 100,
            })
        );

    const components = path();
    if (components == false && NotFound.size == 0) {
        console.timeEnd(t);
        throw Error(`${window.location.pathname} is not a registered route`);
    } else if (NotFound.size != 0 && components == false) {
        r(NotFound, undefined);
        console.timeEnd(t);
        return true;
    } else if (components != false) {
        r(components);
        console.timeEnd(t);
        return true;
    } else {
        throw Error(`${window.location.pathname} is an invalid route`);
    }
};

/**
 * Generates and hydrates a given component
 * @param i The function to generate the component from
 * @param name Name of the component
 */
export const hydrate = (i: Component) => {
    const el: HTMLElement = i?.call(null);
    emit(document.body, EventType.Initialized, {
        component: i.name.toLowerCase(),
    });

    const kids: HTMLElement[] = Array.from(el.children).map(
        el => el as HTMLElement
    );
    const hasLink = kids.filter(
        (kid: HTMLElement) =>
            kid instanceof HTMLAnchorElement &&
            kid.href &&
            new URL(kid.href).origin.startsWith(window.location.origin) == true
    );

    if (hasLink.length >= 1) {
        hasLink.forEach(i =>
            i.addEventListener("click", evt => {
                if (i.dataset.bound) return;
                i.dataset.bound = "true";
                goTo(evt, new URL((i as HTMLAnchorElement).href));
            })
        );
    }

    if (
        el instanceof HTMLAnchorElement &&
        new URL(el.href).origin.startsWith(window.location.origin) == true
    ) {
        el.addEventListener("click", evt => {
            if (el.dataset.bound) return;
            el.dataset.bound = "true";
            goTo(evt, new URL((el as HTMLAnchorElement).href));
        });
    }

    el.dataset.component = i.name.toLowerCase();
    return el;
};

/**
 * Re-renders a single component
 * @param component The component to redraw
 */
export const redraw = (cmp: string | Component) => {
    let component = cmp;
    if (typeof cmp == "function") {
        component = cmp.name.toLowerCase();
    }

    if (typeof component == "function") {
        component = component.name.toLowerCase();
    }

    const cmpFunction = Components.get(component);
    if (cmpFunction) {
        const { el, fn } = cmpFunction;

        el.replaceWith(hydrate(fn));
        emit(el as HTMLElement, EventType.Redraw);
    } else {
        throw Error(`component ${component} is not registered`);
    }
};

export * from "../std/index";
